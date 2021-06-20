const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = mongoose.Schema(
  {
    name: String,
    members: [{
      id: Schema.Types.ObjectId,
      name: String,
      email: String,
      address: String
    }],
    creatorId: Schema.Types.ObjectId,
    isAssigned: Boolean,
    pairings: [{
      gifter: {
        id: Schema.Types.ObjectId,
        name: String,
        email: String
      },
      giftee: {
        id: Schema.Types.ObjectId,
        name: String,
        email: String
      }
    }],
    signUpEndDate: Date,
    endDate: Date,
    exclusions: [{
      person1: Schema.Types.ObjectId,
      person2: Schema.Types.ObjectId
    }]
  },
  {
    collection: 'groups'
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Group', GroupSchema, 'groups');
