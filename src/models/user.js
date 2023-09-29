const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;
const { model } = mongoose;
const Task = require('./task');

// Create new Schema
userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error(`Password can not contain 'Password'`);
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number');
        }
      },
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

// Virtual property
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// Hidding private data
userSchema.methods.toJSON = function () {
  const user = this;

  // Getting back raw object with our user data
  const userObject = user.toObject();

  //Removing the private data
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

// Generating jason web token (jwt) for authentication
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_Secret);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Authenticating email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  // console.log(user.password);
  // console.log(isMatch);
  if (!isMatch) throw new Error('Unable to login');

  // console.log(user);
  return user;
};

// Creating a hashing middleware to hash the plain text password
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash password if it was moldified or hasn't been hashed
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
  // console.log(user.password);
});

// Delete user task when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

// Create a collection
const User = model('User', userSchema);

module.exports = User;
