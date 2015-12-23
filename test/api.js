import request from 'supertest';
import {expect} from 'chai';
import HTTPStatus from 'http-status';
import mongoose from 'mongoose';
import {Bookmark} from '../server/models';
import {start} from '../server';

describe('API', () => {
  let server;
  before(() => {
    server = start('test');
  });
  beforeEach(done => {
    done();
  });
  afterEach(done => {
    mongoose.connection.db.dropDatabase().then(() => done());
  });
  after(done => {
    mongoose.connection.close(() => {
      server.close(done);
    });
  });
  it('GET /bookmarks/:id should return that bookmark', done => {
    done();
  });
});
