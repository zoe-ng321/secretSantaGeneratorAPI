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

exports.findUser = async (req, res ) => {
  if (!req.body){
    res.status(400).send({
      message: ("")
    })
  }
}
