import {Router} from 'express';
import passport from 'passport';
import {User, Bookmark} from './models';
import Auth from './auth';

const api = Router();

api.post('/users', (req, res, next) => {
  const {email, password} = req.body;
  User.register(email, password)
    .then(user => {
      req.logIn(user, err => {
        if (err) next(err);
        res.json(user);
      });
    })
    .catch(err => {
      //TODO: Check if server error
      const error = new Error();
      error.statusCode = 409;
      error.message = err.message;
      next(error);
    });
});


api.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) next(err);
    if (!user) {
      const err = new Error();
      err.statusCode = 401;
      err.message = info.message;
      next(err);
    }
    req.logIn(user, err => {
      if (err) next(err);
      res.json(user);
    });
  })(req, res, next);
});

api.post('/users/logout', Auth.ensureAuthenticated, (req, res) => {
  req.logout();
  res.json({message: 'Logged out'});
});

api.get('/bookmarks', Auth.ensureAuthenticated, (req, res) => {
  Bookmark.find({user: req.user._id})
    .then(bookmarks => res.json(bookmarks))
    .catch(err => next(err));
});

api.post('/bookmarks', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

api.get('/bookmarks/:id', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

api.put('/bookmarks/:id', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

api.delete('/bookmarks/:id', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

export default api;
