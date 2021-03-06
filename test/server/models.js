import {expect} from 'chai';
import mongoose from 'mongoose';
import {Bookmark, User} from '../../src/server/models';

describe('models', () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/bookmarks_test');
    mongoose.Promise = Promise;
    mongoose.connection.on('connected', done);
  });
  beforeEach(done => {
    const user = {email: 'email@email.com', password: '123456'};
    User.create(user)
      .then(() => done())
      .catch(done);
  });
  afterEach(done => {
    mongoose.connection.db.dropDatabase().then(() => done());
  });
  after(done => {
    mongoose.connection.close(done);
  });
  describe('User', () => {
    it('Should fail validation if email is invalid', done => {
      const user = {email: 'invalid', password: 'password'};
      User.create(user)
        .catch(err => {
          expect(err).to.exist;
          expect(err.name).to.equal('ValidationError');
          expect(err.errors.email.message).to.equal('Invalid Email');
          done();
        });
    });
    it('#hashPassword should hash password', done => {
      const user = new User({email: 'test@test.com', password: 'password'});
      user.hashPassword()
        .then(user => {
          expect(user).to.exist;
          expect(user.email).to.equal('test@test.com');
          expect(user.password).to.not.equal('password');
          done();
        })
        .catch(done);
    });
    it('#validPassword should return true if passwords match', done => {
      const user = new User({email: 'test@test.com', password: 'password'});
      user.hashPassword()
        .then(user => user.validPassword('password'))
        .then(isMatch => {
          expect(user.password).to.not.equal('password');
          expect(isMatch).to.be.true;
          done();
        })
        .catch(done);
    });
    it('#validPassword should return false if passwords don\'t match', done => {
      const user = new User({email: 'test@test.com', password: 'password'});
      user.hashPassword()
        .then(user => user.validPassword('not_correct'))
        .then(isMatch => {
          expect(user.password).to.not.equal('password');
          expect(isMatch).to.be.false;
          done();
        })
        .catch(done);
    });
    it('Should hash password on save', done => {
      const user = new User({email: 'test@test.com', password: 'password'});
      user.save()
        .then(user => User.findOne().sort({_id: -1}))
        .then(user => {
          expect(user).to.exist;
          expect(user._id).to.exist;
          expect(user.email).to.equal('test@test.com');
          expect(user.password).to.not.equal('password');
          done();
        })
        .catch(done);
    });
    it('#login should fail if user doesn\'t exist', done => {
      User.login('idonotexist@email.com', 'password')
        .then(done)
        .catch(err => {
          expect(err).to.exist;
          expect(err.name).to.not.exist;
          expect(err.message).to.equal('Login failed');
          expect(err.errors).to.have.length(1);
          expect(err.errors[0].field).to.equal('email');
          expect(err.errors[0].message).to.equal('Incorrect Email');
          done();
        }).catch(done);
    });
    it('#login should fail if password incorrect', done => {
      User.login('email@email.com', 'incorrect')
        .then(done)
        .catch(err => {
          expect(err).to.exist;
          expect(err.name).to.not.exist;
          expect(err.message).to.equal('Login failed');
          expect(err.errors).to.have.length(1);
          expect(err.errors[0].field).to.equal('password');
          expect(err.errors[0].message).to.equal('Incorrect Password');
          done();
        }).catch(done);
    });
    it('#login should return user if all correct', done => {
      User.login('email@email.com', '123456')
        .then(user => {
          expect(user).to.exist;
          expect(user.email).to.equal('email@email.com');
          User.findOne({email: 'email@email.com'})
            .then(user => {
              expect(user).to.exist;
              done();
            });
        })
        .catch(done);
    });
    it('#register should fail if user already exists', done => {
      User.register('email@email.com', 'some_password')
        .then(done)
        .catch(err => {
          expect(err).to.exist;
          expect(err.name).to.not.exist;
          expect(err.message).to.equal('Registration failed');
          expect(err.errors).to.have.length(1);
          expect(err.errors[0].field).to.equal('email');
          expect(err.errors[0].message).to.equal('User with this email already exists');
          done();
        }).catch(done);
    });
    it('#register should return new user if no user with same email', done => {
      User.register('an_email@email.co.uk', 'super_secret')
        .then(user => {
          expect(user).to.exist;
          expect(user.email).to.equal('an_email@email.co.uk');
          expect(user.password).to.not.equal('super_secret');
          User.findOne({email: 'an_email@email.co.uk'})
            .then(user => {
              expect(user).to.exist;
              done();
            });
        })
        .catch(done);
    });
  });
  describe('Bookmark', () => {
    it('Should fail validation is url isn\'t valid', done => {
      const bookmark = new Bookmark({title: 'some cool page', url: 'not_correct'});
      bookmark.save()
        .catch(err => {
          expect(err).to.exist;
          expect(err.name).to.equal('ValidationError');
          expect(err.errors.url.message).to.equal('Invalid URL');
          done();
        });
    });
    it('Should fail if user not specified', done => {
      const bookmark = new Bookmark({url: 'google.com'});
      bookmark.save()
        .catch(err => {
          expect(err).to.exist;
          expect(err.name).to.equal('ValidationError');
          expect(err.errors.user.message).to.equal('Path `user` is required.');
          done();
        });
    });
  });
});
