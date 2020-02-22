const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'A user must have a valid email'],
    unique: true,
    lowercase: true,
    validade: [validator.isEmail, 'a user must have a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A user password must have a min length of 8 characters']
  },
  confirmPassword: {
    type: String,
    required: [true, 'A user must have a password']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
