const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    address: String,
    groupList: [{
      groupId: Schema.Types.ObjectId,
      name: String,
      signUpEndDate: Date,
      endDate: Date
    }]
  },
  {
    collection: 'users'
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema, 'users');
