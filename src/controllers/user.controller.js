const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Login content can not be empty"
        });
    }

    let {email, password} = req.body;
    let user = await User.findOne({
      email: email
    })
    if (!user){
      return res.status(400).json({
        type: "Not Found",
        msg: "User not found"
      })
    }
    let validPw = await bcrypt.compare(password, user.password);
    user = user.toObject();
    delete user.password;
    // modify to return token
    if (validPw){
      res.status(200).json({
        status: "Success",
        message: "Successfully logged in",
        data: user
      })
    }else{
      res.status(401).json({
        status: "Unauthorized",
        message: "Unauthorized"
      })
    }
};

exports.registration = async (req, res) => {

    if(!req.body) {
      return res.status(400).send({
        message: "Registration content can not be empty"
      });
    }

    let alreadyRegistered = await User.findOne({
      email: req.body.email
    });

    if (alreadyRegistered){
      return res.status(400).send({
        message: "User already registered."
      });
    }

    // Create a User
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      address: req.body.address
    });

    // Save user in the database
    user.save()
    .then(data => {
        res.status(200).json({
            status: "Success"
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.findUser = async (req, res) => {
  if (!req.body){
    return res.status(400).send({
      message: "Empty request body"
    })
  }
  let {email} = req.body;
  let user = await User.findOne({
    email: email
  })

  if (!user){
    return res.status(400).json({
      type: "Not Found",
      msg: "User not found"
    })
  }else{
    user = user.toObject();
    delete user.password;
    return res.status(200).json({
      status: "Success",
      message: "user found",
      data: user
    })
  }
}

exports.updateProfile = async (req, res) => {
  if (!req.body){
    return res.status(400).send({
      message: "Empty request body"
    })
  }

  const {email, address, firstName, lastName} = req.body;
  const update = { address: address, firstName: firstName, lastName: lastName};
  const filter = { email : email };

  const updatedUser = await User.findOneAndUpdate(filter, update, { new: true }).catch(error => {
    return res.status(500).send(error);
  });

  updatedUser = updatedUser.toObject();
  delete updatedUser.password;

  return res.status(200).json({
    message : "Updated user",
    data: updatedUser
  });
}

exports.updatePassword = async (req, res) => {
  if (!req.body){
    return res.status(400).send({
      message: "Empty request body"
    })
  }

  const {email, oldPassword, newPassword} = req.body;
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
