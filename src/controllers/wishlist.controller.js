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

    wishlist.save()
    .then(data => {
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

    await Wishlist.findOneAndUpdate(filter, update, { new: true })
    .then(data => {
      return res.status(200).json({
        message : "Updated wishlist",
        data: data
      });
    }).catch(error => {
      return res.status(500).send(error);
    });


};

exports.getWishlistForUserInGroup = async (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }
  await Wishlist.findOne({
    groupId: req.body.groupId,
    userId: req.user.id
  }).then(data => {
    return res.status(200).json({
      data: data,
      message: "Found wishlist for user"
    })
  }).catch(error => {
    return res.status(400).json({
      type: "Not Found",
      msg: "wishlist not found"
    })
  })
}

exports.getWishlistsForGroup = async (req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }
  await Wishlist.find({
    groupId: req.body.groupId
  }).then(data => {
    return res.status(200).json({
      data: data,
      message: "Found wishlists for group"
    })
  }).catch(error=>{
    return res.status(400).json({
      type: "Not Found",
      msg: "wishlists not found"
    })
  })
}
