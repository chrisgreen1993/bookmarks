/* jshint expr:true */
import request from 'supertest';
import {expect} from 'chai';
import HTTPStatus from 'http-status';
import mongoose from 'mongoose';
import {Bookmark, User} from '../server/models';
import {start} from '../server';

describe('api', () => {
  let server;
  before(() => {
    server = start('test');
  });
  let cookie;
  beforeEach(done => {
    const user = {email: 'email@email.com', password: "123456"};
    User.create(user)
      .then(() =>  {
        request(server).post('/api/users/login').send(user).expect(200).end((err, res) => {
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
      .expect({status: 404, error: 'Not Found'}, done);
  });
  it('POST /users/login should return 401 if incorrect email', done => {
    const login = {email: 'email@not_exist.com', password: 'password'};
    request(server)
      .post('/api/users/login')
      .send(login)
      .expect(401)
      .expect({status: 401, error: 'Unauthorized', message: 'Incorrect Email'})
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
      .expect({status: 401, error: 'Unauthorized', message: 'Incorrect Password'})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers).to.not.have.property('set-cookie');
        done();
      });
  });
  it('POST /users/login should return user', done => {
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
      .expect({status: 401, error: 'Unauthorized'}, done);
  });
  it('POST /users/logout should logout user', done => {
    request(server)
      .post('/api/users/logout')
      .set('Cookie', cookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // User logged out, should fail
        request(server)
          .post('/api/users/logout')
          .set('Cookie', cookie)
          .expect(401, done);
      });
  });
});
