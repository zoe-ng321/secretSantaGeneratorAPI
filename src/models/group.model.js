const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = mongoose.Schema(
  {
    name: String,
    members: [Schema.Types.ObjectId],
    creatorId: Schema.Types.ObjectId,
    isAssigned: Boolean,
    pairings: [{
      gifter: Schema.Types.ObjectId,
      giftee: Schema.Types.ObjectId
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
