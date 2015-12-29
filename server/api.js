import {Router} from 'express';
import passport from 'passport';
import createError from 'http-errors';
import {User, Bookmark} from './models';
import Auth from './auth';

function extractErrors(err) {
  return Object.keys(err.errors).map(prop => ({field: err.errors[prop].path, message: err.errors[prop].message}));
}

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
      if (err.name === 'Error') return next(err);
      if (err.name === 'ValidationError') {
        const errors = extractErrors(err);
        return next(createError(400, err.message, {errors}));
      }
      return next(createError(409, err.message));
    });
});


api.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(createError(401, info.message));
    req.logIn(user, err => {
      if (err) return next(err);
      res.json(user);
    });
  })(req, res, next);
});

api.post('/users/logout', Auth.ensureAuthenticated, (req, res) => {
  req.logout();
  res.status(204).send();
});

api.get('/bookmarks', Auth.ensureAuthenticated, (req, res, next) => {
  Bookmark.find({user: req.user._id})
    .then(bookmarks => res.json(bookmarks))
    .catch(err => next(err));
});

api.post('/bookmarks', Auth.ensureAuthenticated, (req, res, next) => {
  const {title, url} = req.body;
  Bookmark.create({title, url, user: req.user._id})
    .then(bookmark => res.json(bookmark))
    .catch(err => {
      if (err.name === 'ValidationError') {
        const errors = extractErrors(err);
        return next(createError(400, err.message, {errors}));
      }
      next(err);
    });
});

api.get('/bookmarks/:id', Auth.ensureAuthenticated, (req, res, next) => {
  Bookmark.findOne({user: req.user._id, _id: req.params.id})
    .then(bookmark => {
      if (!bookmark) return next(createError(404));
      res.json(bookmark);
    })
    .catch(err => {
      // Mongoose throws CastError if ID not valid ObjectId - E.g: 123
      // But we still want to throw a 404 with these
      if (err.name === 'CastError') return next(createError(404));
      next(err);
    });
});

api.put('/bookmarks/:id', Auth.ensureAuthenticated, (req, res, next) => {
  const {title, url} = req.body;
  const options = {new: true, runValidators: true};
  Bookmark.findOneAndUpdate({user: req.user._id, _id: req.params.id}, {title, url}, options)
    .then(bookmark => {
      if (!bookmark) return next(createError(404));
      res.json(bookmark);
    })
    .catch(err => {
      // Mongoose throws CastError if ID not valid ObjectId - E.g: 123
      // But we still want to throw a 404 with these
      if (err.name === 'CastError') return next(createError(404));
      // TODO: error message
      if (err.name === 'ValidationError') {
        const errors = extractErrors(err);
        // Mongoose doesn't put model name at the start for findOneAndUpdate
        const message = 'Bookmark ' + err.message.toLowerCase();
        return next(createError(400, message, {errors}));
      }
      next(err);
    });
});

api.delete('/bookmarks/:id', Auth.ensureAuthenticated, (req, res, next) => {
  Bookmark.remove({user: req.user._id, _id: req.params.id})
    .then((obj) => {
      if (obj.result.n === 0) return next(createError(404));
      res.status(204).send();
    })
    .catch((err) => {
      // Mongoose throws CastError if ID not valid ObjectId - E.g: 123
      // But we still want to throw a 404 with these
      if (err.name === 'CastError') return next(createError(404));
      next(err);
    });
});

export default api;
