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
        if (err) return next(err);
        res.json(user);
      });
    })
    .catch(err => {
      //TODO: Check if server error
      const error = new Error();
      error.statusCode = 409;
      error.message = err.message;
      return next(error);
    });
});


api.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const err = new Error();
      err.statusCode = 401;
      err.message = info.message;
      return next(err);
    }
    req.logIn(user, err => {
      if (err) return next(err);
      res.json(user);
    });
  })(req, res, next);
});

api.post('/users/logout', Auth.ensureAuthenticated, (req, res) => {
  req.logout();
  res.json({message: 'Logged out'});
});

api.get('/bookmarks', Auth.ensureAuthenticated, (req, res, next) => {
  Bookmark.find({user: req.user._id})
    .then(bookmarks => res.json(bookmarks))
    .catch(err => next(err));
});

api.post('/bookmarks', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

api.get('/bookmarks/:id', Auth.ensureAuthenticated, (req, res, next) => {
  Bookmark.findOne({user: req.user._id, _id: req.params.id})
    .then(bookmark => {
      if (!bookmark) {
        const err = new Error();
        err.statusCode = 404;
        return next(err);
      }
      res.json(bookmark);
    })
    .catch(err => {
      // Mongoose throws CastError if ID not valid ObjectId - E.g: 123
      // But we still want to throw a 404 with these
      if (err.name === 'CastError') {
        const err = new Error();
        err.statusCode = 404;
        return next(err);
      }
      return next(err);
    });
});

api.put('/bookmarks/:id', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

api.delete('/bookmarks/:id', Auth.ensureAuthenticated, (req, res) => {
  res.json({message: 'TODO'});
});

export default api;
