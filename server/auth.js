import LocalStrategy from 'passport-local';
import createError from 'http-errors';
import {User} from './models';

function authenticate() {
  return new LocalStrategy({
    usernameField: 'email'
  },
  (email, password, done) => {
    User.login(email, password)
      .then(user => done(null, user))
      .catch(err => {
        if (err.name === 'Error') return done(err);
        done(null, false, err);
      });
  });
}

function serialize() {
  return (user, done) => done(null, user._id);
}

function deserialize() {
  return (id, done) => User.findById(id, done);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  next(createError(401));
}

export default {authenticate, serialize, deserialize, ensureAuthenticated};
