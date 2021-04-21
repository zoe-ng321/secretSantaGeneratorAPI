const User = require('../models/user.model.js');
const Group = require('../models/group.model.js');
const Wishlist = require('../models/wishlist.model.js');

exports.addWishlist = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "No content"
        });
    }

    const wishlist = new Wishlist({
      wishlist: req.body.wishlist,
      groupId: req.body.groupId,
      userId: req.user.id
    })

    wishlist.save().then(data => {
      return res.status(200).json({
        message : "Added wishlist",
        data: wishlist
      });
    }).catch(err => {
      return res.status(400).send({
          message: err.message
      });
    })
};

exports.updateWishlist = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "No content"
        });
    }

    let {wishlist, groupId} = req.body;
    const update = { wishlist: wishlist};
    const filter = { userId : req.user.id, groupId: groupId};

    const updateWishlist = await Wishlist.findOneAndUpdate(filter, update, { new: true }).catch(error => {
      return res.status(500).send(error);
    });

    return res.status(200).json({
      message : "Updated wishlist",
      data: updateWishlist
    });
};

exports.getWishlistForUserInGroup = async (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }
  let wishlist = await Wishlist.findOne({
    groupId: req.body.groupId,
    userId: req.body.userId
  })
  if (!wishlist){
    return res.status(400).json({
      type: "Not Found",
      msg: "wishlist not found"
    })
  }else{
    return res.status(200).json({
      data: wishlist,
      message: "Found wishlist for user"
    })
  }
}

exports.getWishlistsForGroup = async (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }
  let wishlist = await Wishlist.find({
    groupId: req.body.groupId
  })
  if (!wishlist){
    return res.status(400).json({
      type: "Not Found",
      msg: "wishlists not found"
    })
  }else{
    return res.status(200).json({
      data: wishlist,
      message: "Found wishlists for group"
    })
  }
}
