const User = require('../models/user.model.js');
const Group = require('../models/group.model.js');
const Wishlist = require('../models/wishlist.model.js');

exports.updateWishlist = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "No content"
        });
    }

    let {wishlist, id} = req.body;
    const update = { wishlist: wishlist};
    const filter = { userId : id };

    const updateWishlist = await Wishlist.findOneAndUpdate(filter, update, { new: true }).catch(error => {
      return res.status(500).send(error);
    });

    return res.status(200).json({
      message : "Updated wishlist",
      data: updateWishlist
    });
};

exports.getWishlistForUser = async (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }
}

exports.getWishlistsForGroup = async (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }
}
