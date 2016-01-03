import request from 'supertest';
import {expect} from 'chai';
import mongoose from 'mongoose';
import {Bookmark, User} from '../../src/server/models';
import {start} from '../../src/server';

describe('api', () => {
  let server;
  before(() => {
    server = start('test');
  });
  let cookie;
  beforeEach(done => {
    const user = {email: 'email@email.com', password: '123456'};
    User.create(user)
      .then(newUser => {
        const bookmarks = [
          {title: 'cool webpage', url: 'webpage.com/hello', user: newUser._id},
          {title: 'search', url: 'google.com', user: newUser._id},
        ];
        return Bookmark.create(bookmarks);
      })
      .then(() => {
        request(server).post('/api/users/login').send(user).expect(200).end((err, res) => {
          if (err) return done(err);
          cookie = res.headers['set-cookie'].pop().split(';')[0];
          done();
        });
      })
      .catch(done);
  });
  afterEach(done => {
    mongoose.connection.db.dropDatabase().then(() => done());
  });
  after(done => {
    mongoose.connection.close(() => {
      server.close(done);
    });
  });
  it('Routes which don\'t exist should return 404', done => {
    request(server)
      .get('/api/not_here')
      .expect(404)
      .expect({message: 'Not Found'}, done);
  });
  it('POST /users/login should return 401 if incorrect email', done => {
    const login = {email: 'email@not_exist.com', password: 'password'};
    request(server)
      .post('/api/users/login')
      .send(login)
      .expect(401)
      .expect({message: 'Incorrect Email'})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers).to.not.have.property('set-cookie');
        done();
      });
  });
  it('POST /users/login should return 401 if incorrect password', done => {
    const login = {email: 'email@email.com', password: 'password'};
    request(server)
      .post('/api/users/login')
      .send(login)
      .expect(401)
      .expect({message: 'Incorrect Password'})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers).to.not.have.property('set-cookie');
        done();
      });
  });
  it('POST /users/login should return user and cookie', done => {
    const login = {email: 'email@email.com', password: '123456'};
    request(server)
      .post('/api/users/login')
      .send(login)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.all.keys('_id', 'email');
        expect(res.body.email).to.equal('email@email.com');
        expect(res.headers).to.have.property('set-cookie');
        done();
      });
  });
  it('Unauthenticated user shouldn\'t be able to access protected endpoints', done => {
    request(server)
      .get('/api/bookmarks')
      .expect(401)
      .expect({message: 'Unauthorized'}, done);
  });
  it('POST /users/logout should logout user', done => {
    request(server)
      .post('/api/users/logout')
      .set('Cookie', cookie)
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        // User logged out, should fail
        request(server)
          .post('/api/users/logout')
          .set('Cookie', cookie)
          .expect(401, done);
      });
  });
  it('POST /users should return 409 if user with email already exists', done => {
    const user = {email: 'email@email.com', password: 'password'};
    request(server)
      .post('/api/users')
      .send(user)
      .expect(409)
      .expect({message: 'User with this email already exists'}, done);
  });
  it('POST /users should return new user and log them in', done => {
    const user = {email: 'hello@email.net', password: 'super_strong_and_safe'};
    request(server)
      .post('/api/users')
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.all.keys('_id', 'email');
        expect(res.body.email).to.equal('hello@email.net');
        expect(res.headers).to.have.property('set-cookie');
        done();
      });
  });
  it('POST /users should return 400 if email invalid', done => {
    const user = {email: 'not_an_email', password: 'a_password'};
    request(server)
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect({message: 'User validation failed', errors: [{field: 'email', message: 'Invalid Email'}]}, done);
  });
  it('GET /bookmarks should get logged in users bookmarks', done => {
    request(server)
      .get('/api/bookmarks')
      .set('Cookie', cookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        User.findOne({email: 'email@email.com'})
          .then(user => {
            expect(res.body).to.exist;
            expect(res.body).to.have.length(2);
            res.body.map(bookmark => expect(bookmark).to.have.all.keys('_id', 'title', 'url', 'user'));
            expect(res.body[0].title).to.equal('cool webpage');
            expect(res.body[0].url).to.equal('webpage.com/hello');
            expect(res.body[0].user).to.equal(user._id.toString());
            expect(res.body[1].title).to.equal('search');
            expect(res.body[1].url).to.equal('google.com');
            expect(res.body[1].user).to.equal(user._id.toString());
            done();
          })
          .catch(done);
      });
  });
  it('GET /bookmarks should return empty array when user has no bookmarks', done => {
    Bookmark.remove({})
      .then(() => {
        request(server)
          .get('/api/bookmarks')
          .set('Cookie', cookie)
          .expect(200)
          .expect([], done);
      })
      .catch(done);
  });
  it('POST /bookmarks should create a new bookmark for logged in user', done => {
    const bookmark = {title: 'super cool site', url: 'chrisgreen1993.com'};
    request(server)
      .post('/api/bookmarks')
      .set('Cookie', cookie)
      .send(bookmark)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        User.findOne({email: 'email@email.com'})
          .then(user => {
            expect(res.body).to.exist;
            expect(res.body).to.have.all.keys('_id', 'title', 'url', 'user');
            expect(res.body.title).to.equal('super cool site');
            expect(res.body.url).to.equal('chrisgreen1993.com');
            expect(res.body.user).to.equal(user._id.toString());
            done();
          })
          .catch(done);
      });
  });
  it('POST /bookmarks should return 400 if no POST data', done => {
    request(server)
      .post('/api/bookmarks')
      .set('Cookie', cookie)
      .send({})
      .expect(400)
      .expect({message: 'Bookmark validation failed', errors: [{field: 'url', message: 'Path `url` is required.'}]}, done);
  });
  it('POST /bookmarks should return 400 if url isn\'t valid', done => {
    request(server)
      .post('/api/bookmarks')
      .set('Cookie', cookie)
      .send({'url': 54647})
      .expect(400)
      .expect({message: 'Bookmark validation failed', errors: [{field: 'url', message: 'Invalid URL'}]}, done);
  });
  it('GET /bookmarks/:id should return bookmark', done => {
    Bookmark.findOne({title: 'search'})
      .then(bookmark => {
        request(server)
          .get('/api/bookmarks/' + bookmark._id.toString())
          .set('Cookie', cookie)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.exist;
            expect(res.body).to.have.all.keys('_id', 'title', 'url', 'user');
            expect(res.body._id).to.equal(bookmark._id.toString());
            expect(res.body.title).to.equal('search');
            expect(res.body.url).to.equal('google.com');
            expect(res.body.user).to.equal(bookmark.user.toString());
            done();
          });
      });
  });
  it('GET /bookmarks/:id should return 404 if bookmark doesn\'t exist', done => {
    request(server)
      .get('/api/bookmarks/123345') // Invalid ID
      .set('Cookie', cookie)
      .expect(404)
      .expect({message: 'Not Found'})
      .end((err, res) => {
        if (err) return done(err);
        const id = '551137c2f9e1fac808a5f572'; // Valid ID - doesn't exist
        expect(mongoose.Types.ObjectId.isValid(id)).to.be.true;
        request(server)
          .get('/api/bookmarks/' + id)
          .set('Cookie', cookie)
          .expect(404)
          .expect({message: 'Not Found'}, done);
      });
  });
  it('PUT /bookmarks/:id should update bookmark', done => {
    const bookmarkUpdate = {title: 'updated this', url: 'webpage.com/updated_this'};
    Bookmark.findOne({title: 'cool webpage'})
      .then(bookmark => {
        request(server)
          .put('/api/bookmarks/' + bookmark._id.toString())
          .set('Cookie', cookie)
          .send(bookmarkUpdate)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.exist;
            expect(res.body).to.have.all.keys('_id', 'title', 'url', 'user');
            expect(res.body._id).to.equal(bookmark._id.toString());
            expect(res.body.title).to.equal('updated this');
            expect(res.body.url).to.equal('webpage.com/updated_this');
            expect(res.body.user).to.equal(bookmark.user.toString());
            done();
          });
      });
  });
  it('PUT /bookmarks/:id should return 400 if url isn\'t valid', done => {
    const bookmarkUpdate = {title: 'updated this', url: 'not_valid'};
    Bookmark.findOne({title: 'cool webpage'})
      .then(bookmark => {
        request(server)
          .put('/api/bookmarks/' + bookmark._id.toString())
          .set('Cookie', cookie)
          .send(bookmarkUpdate)
          .expect(400)
          .expect({message: 'Bookmark validation failed', errors: [{field: 'url', message: 'Invalid URL'}]}, done);
      });
  });
  it('PUT /bookmarks/:id should return 404 if bookmark doesn\'t exist', done => {
    const bookmarkUpdate = {title: 'updated this', url: 'webpage.com/updated_this'};
    request(server)
      .put('/api/bookmarks/23563463') // Invalid ID
      .set('Cookie', cookie)
      .send(bookmarkUpdate)
      .expect(404)
      .expect({message: 'Not Found'})
      .end((err, res) => {
        if (err) return done(err);
        const id = '551137c2f9e1fac808a5f572'; // Valid ID - doesn't exist
        expect(mongoose.Types.ObjectId.isValid(id)).to.be.true;
        request(server)
          .put('/api/bookmarks/' + id)
          .set('Cookie', cookie)
          .send(bookmarkUpdate)
          .expect(404)
          .expect({message: 'Not Found'}, done);
      });
  });
  it('DELETE /bookmarks/:id should delete bookmark', done => {
    Bookmark.findOne({title: 'cool webpage'})
      .then(bookmark => {
        request(server)
          .delete('/api/bookmarks/' + bookmark._id.toString())
          .set('Cookie', cookie)
          .expect(204)
          .end((err, res) => {
            if (err) return done();
            Bookmark.count({_id: bookmark._id})
              .then(count => {
                expect(count).to.equal(0);
                done();
              })
              .catch(done);
          });
      });
  });
  it('DELETE /bookmarks/:id should return 404 if bookmark doesn\'t exist', done => {
    request(server)
      .delete('/api/bookmarks/23563463') // Invalid ID
      .set('Cookie', cookie)
      .expect(404)
      .expect({message: 'Not Found'})
      .end((err, res) => {
        if (err) return done(err);
        const id = '551137c2f9e1fac808a5f572'; // Valid ID - doesn't exist
        expect(mongoose.Types.ObjectId.isValid(id)).to.be.true;
        request(server)
          .delete('/api/bookmarks/' + id)
          .set('Cookie', cookie)
          .expect(404)
          .expect({message: 'Not Found'}, done);
      });
  });
});
