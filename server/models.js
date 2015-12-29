import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const BookmarkSchema = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Invalid URL']
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

BookmarkSchema.set('toJSON', {versionKey: false});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'Invalid Email']
  },
  password: {type: String, required: true}

});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.hashPassword().then(next).catch(next);
});

UserSchema.methods = {
  validPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return reject(err);
        resolve(isMatch);
      });
    });
  },
  hashPassword() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(5, (err, salt) => {
        if (err) return reject(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) return reject(err);
          this.password = hash;
          resolve(this);
        });
      });
    });
  }
};

UserSchema.statics = {
  register(email, password) {
    return new Promise((resolve, reject) => {
      this.findOne({email: email})
        .then(user => {
          if (user) return reject({message: 'User with this email already exists'});
          return User.create({email, password});
        })
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  },
  login(email, password) {
    return new Promise((resolve, reject) => {
      this.findOne({email: email})
        .then(user => {
          if (!user) return reject({message: 'Incorrect Email'});
          user.validPassword(password)
            .then(isMatch => {
              if (!isMatch) return reject({message: 'Incorrect Password'});
              resolve(user);
            });
        })
        .catch(err => reject(err));
    });
  }
};

UserSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
const User = mongoose.model('User', UserSchema);

export {Bookmark, User};
