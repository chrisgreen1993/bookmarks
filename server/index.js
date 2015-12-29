import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import createError from 'http-errors';
import api from './api';
import Auth from './auth';

function start(config) {
  process.env.NODE_ENV = config;
  const app = express();

  const dbName = (app.get('env') === 'test') ? 'bookmarks_test' : 'bookmarks';
  const db = mongoose.connect('mongodb://localhost/' + dbName).connection;
  db.on('error', console.error.bind(console, 'connection error'));
  mongoose.Promise = Promise;


  app.use(bodyParser.json());
  app.use(session({secret: 'change_this', resave: true, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(Auth.authenticate());
  passport.serializeUser(Auth.serialize());
  passport.deserializeUser(Auth.deserialize());

  app.use('/api', api);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({message: err.message});
  });

  app.use((req, res, next) => {
    const err = createError(404);
    res.status(404).json({message: err.message});
  });

  const server = app.listen(8000, 'localhost', () => {
    const {address, port} = server.address();
    console.log('Server listening at http://%s:%s', address, port);
  });
  return server;
}

export {start};
