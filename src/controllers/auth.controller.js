const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign({
      name: user.firstName + " " + user.lastName,
      firstName: user.firstName,
      id: user._id,
      email: user.email
    },
      process.env.TOKEN_SECRET
    );
    res.header("auth-token", token).json({
      error: null,
      data: {
        token
      },
    });
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
