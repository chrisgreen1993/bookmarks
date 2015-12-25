import LocalStrategy from 'passport-local';
import {User} from './models';

function authenticate() {
  return new LocalStrategy({
    usernameField: 'email'
  },
  (email, password, done) => {
    User.login(email, password)
      .then(user => done(null, user))
      .catch(err => done(null, false, err));
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
  const err = new Error();
  err.statusCode = 401;
  next(err);
}

export default {authenticate, serialize, deserialize, ensureAuthenticated};
