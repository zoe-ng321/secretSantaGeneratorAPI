const mongoose = require('mongoose');
const { Schema } = mongoose;

const WishlistSchema = mongoose.Schema(
  {
    groupId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    wishlist: String
  },
  {
    collection: 'wishlists'
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Wishlist', WishlistSchema, 'wishlists');
