import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import createError from 'http-errors';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';
import session from 'express-session';
import webpackConfig from '../webpack.config';
import api from './api';
import Auth from './auth';

function start(config) {
  process.env.NODE_ENV = config;
  const app = express();

  const dbName = (app.get('env') === 'test') ? 'bookmarks_test' : 'bookmarks';
  const db = mongoose.connect('mongodb://localhost/' + dbName).connection;
  db.on('error', console.error.bind(console, 'connection error'));
  mongoose.Promise = Promise;

  if (app.get('env') !== 'test') {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {publicPath: webpackConfig.output.publicPath}));
    app.use(webpackHotMiddleware(compiler));
  }

  app.use(bodyParser.json());
  app.use(session({secret: 'change_this', resave: true, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(Auth.authenticate());
  passport.serializeUser(Auth.serialize());
  passport.deserializeUser(Auth.deserialize());

  app.use('/api', api);

  app.get('/', (req, res) => res.sendFile(path.join(appRoot, 'client', 'index.html')));

  app.use((err, req, res, next) => {
    console.error(err);
    const {statusCode, message, errors} = err;
    res.status(statusCode || 500).json({message, errors});
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
