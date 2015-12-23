import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import HTTPStatus from 'http-status';
import api from './api';

function start(config) {
  process.env.NODE_ENV = config;
  const app = express();

  const dbName = (app.get('env') === 'test') ? 'bookmarks_test' : 'bookmarks';
  const db = mongoose.connect('mongodb://localhost/' + dbName).connection;
  db.on('error', console.error.bind(console, 'connection error'));
  mongoose.Promise = Promise;


  app.use(bodyParser.json());
  app.use('/api', api);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({status: err.statusCode, message: HTTPStatus[err.statusCode]});
  });

  app.use((req, res, next) => {
    res.status(404).json({status: 404, message: HTTPStatus[404]});
  });

  const server = app.listen(8000, 'localhost', () => {
    const {address, port} = server.address();
    console.log('Server listening at http://%s:%s', address, port);
  });
  return server;
}

export {start};
