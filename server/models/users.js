const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    login: {type: String, required: true },
    githubId: {type: Number, required: true},
    url: {type: String},
    score: {type: Number, required: true},
    phone: {type: Number},
    email: {type: String}
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);