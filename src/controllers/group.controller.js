const User = require('../models/user.model.js');
const Group = require('../models/group.model.js');

exports.createGroup = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "No content"
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
