const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.findUser = async (req, res) => {
  if (!req.body.request){
    return res.status(400).send({
      message: "Empty request body"
    })
  }

  let {email} = req.body.request;

  await User.findOne({
    email: email
  }).then(user => {
    user = user.toObject();
    delete user.password;
    return res.status(200).json({
      status: "Success",
      message: "user found",
      data: user
    })
  }).catch(error=>{
    return res.status(400).json({
      type: "Not Found",
      msg: "User not found"
    })
  })
}

exports.updateProfile = async (req, res) => {
  if (!req.body.request){
    return res.status(400).send({
      message: "Empty request body"
    })
  }

  const {email, address, firstName, lastName} = req.body.request;
  const update = { address: address, firstName: firstName, lastName: lastName};
  const filter = { email : email };

  const updatedUser = await User.findOneAndUpdate(filter, update, { new: true })
  .then(updatedUser => {
    updatedUser = updatedUser.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message : "Updated user",
      data: updatedUser
    });
  })
  .catch(error => {
    return res.status(500).send(error);
  });
}

exports.updatePassword = async (req, res) => {
  if (!req.body.request){
    return res.status(400).send({
      message: "Empty request body"
    })
  }

  const {email, oldPassword, newPassword} = req.body.request;
  let user = await User.findOne({email: email})

  let validPw = await bcrypt.compare(oldPassword, user.password);
  if (validPw){
    const filter = {email: email};
    const encNewPassword = await bcrypt.hash(newPassword, 10)
    const update = {password:encNewPassword}
    const updatedUser = await User.findOneAndUpdate(filter, update, { new: true }).catch(error => {
      return res.status(500).send(error);
    });

    updatedUser = updatedUser.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message : "Updated password",
      data: updatedUser
    });
  }else{
    return res.status(400).json({
      message: "Invalid field"
    })
  }
}
