const User = require('../models/user.model.js');
const Group = require('../models/group.model.js');
const Wishlist = require('../models/wishlist.model.js');

exports.groupDashboard = async (req, res) => {
  if(!req.body.request) {
      return res.status(400).send({
          message: "No content"
      });
  }

  let group = await Group.findOne({
    _id: req.body.request.groupId
  })

  let wishlist = await Wishlist.find({
    groupId: req.body.request.groupId
  })

  let members = group.members
  let data = []

  for (let i = 0; i < members.length; i++){
    let obj = {wishlist: ''};
    for (let j = 0; j < wishlist.length; j++){
      if (wishlist[j].userId.toString() === members[i].id.toString()){
        obj = wishlist[j];
        break;
      }
    }
    data.push({name: members[i].name, address: members[i].address, wishlist: obj.wishlist})
  }

  return res.status(200).json({
    message : "Group dashboard",
    data: data
  });
}

exports.createGroup = async (req, res) => {
    if(!req.body.request) {
        return res.status(400).send({
            message: "No content"
        });
    }

    let user = await User.findOne({
      _id: req.user.id
    })

    // Create a group
    const group = new Group({
      name: req.body.request.name,
      members: [{id: req.user.id, name: req.user.name, address: user.address}],
      creatorId: req.user.id,
      isAssigned: false,
      signUpEndDate: req.body.request.signUpEndDate,
      endDate: req.body.request.endDate,
      exclusions: []
    });

    // Save group in the database
    group.save()
    .then(data => {
        User.findByIdAndUpdate(req.user.id,
          {"$push": {"groupList": {name: req.body.request.name,
            groupId: data._id, signUpEndDate: req.body.request.signUpEndDate,
            endDate: req.body.request.endDate}}}
        ).then(userData => {
          return res.status(200).json({
              status: "Success",
              data: data._id
          })
        }).catch(error => {
          return res.status(500).send(error);
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.joinGroup = async(req, res) => {
  if(!req.body.request) {
      return res.status(400).send({
          message: "No content"
      });
  }

  let group = await Group.findOne({
    _id: req.body.request.groupId
  })

  let userfound = group.members.find(obj => obj.id == req.user.id);
  if (userfound){
    return res.status(400).json({
      message: "Already joined group"
    })
  }

  await User.findByIdAndUpdate(req.user.id,
      { "$push": { "groupList": {name: req.body.request.name, groupId: req.body.request.groupId,
        signUpEndDate: group.signUpEndDate, endDate: group.endDate}}},
      { "new": true, "upsert": true }
  ).then(data => {
    Group.findByIdAndUpdate(req.body.request.groupId,
      { "$push": { "members": {name: req.user.name, id: req.user.id, address: data.address}}},
      { "new": true, "upsert": true }
    ).then(groupData => {
      return res.status(200).json({
          status: "Success"
      })
    }).catch(error => {
      return res.status(500).send(error);
    })
  }).catch(error => {
    return res.status(500).send(error);
  });

}

exports.findGroup = async(req, res) => {
  if(!req.body.request) {
      return res.status(400).send({
          message: "No content"
      });
  }
  await Group.findOne({
    _id: req.body.request.groupId
  }).then(group => {
    return res.status(200).json({
      msg: "group found",
      data: group
    })
  }).catch(error => {
    return res.status(400).json({
      type: "Not Found",
      msg: "group not found"
    })
  })

}

exports.addExclusion = async(req, res) => {
  if(!req.body.request) {
      return res.status(400).send({
          message: "No content"
      });
  }

  const exclusion = {
    person1: req.body.request.id1,
    person2: req.body.request.id2
  }

  await Group.findByIdAndUpdate(req.body.request.groupId,
      { "$push": { "exclusions": exclusion}},
      { "new": true, "upsert": true }
  ).then(data => {
    return res.status(200).json({
      "message": "Exclusion added"
    })
  }).catch(error => {
    return res.status(500).send(error);
  });

}

exports.generatePairings = async(req, res) => {
  if(!req.body.request) {
      return res.status(400).send({
          message: "No content"
      });
  }


  let group = await Group.findOne({
    _id: req.body.request.groupId
  })

  if (!group){
    return res.status(404).send({
        message: "Not found"
    });
  }

  if (group.isAssigned){
    return res.status(404).send({
        message: "Already generated pairings"
    });
  }

  let memberArray = [...group.members]
  let exclusionArray = group.exclusions

  let shuffledArray = shuffle(memberArray)
  while (!checkExclusions(shuffledArray, exclusionArray)){
    shuffledArray = shuffle(memberArray)
  }

  console.log("creating gift array")

  let giftArray = []

  for (let i = 0; i < shuffledArray.length-1; i++){
    giftArray.push({gifter: shuffledArray[i], giftee: shuffledArray[i+1]})
  }
  giftArray.push({gifter: shuffledArray[shuffledArray.length-1], giftee: shuffledArray[0]})

  await Group.updateOne({_id: req.body.request.groupId}, {pairings: giftArray, isAssigned: true})
  .then(data => {
    return res.status(200).json({
      message : "Generated pairings"
    });
  }).catch(error => {
    return res.status(500).send(error);
  });
}

function checkExclusions(array, exclusions){
  console.log("checking exclusions")

  for (let i = 0; i < array.length-1; i++){
    let id1 = array[i].id
    let id2 = array[i+1].id
    for (let j = 0; j < exclusions; j++){
      if ((exclusions[j].person1 === id1 || exclusions[j].person1 === id2) &&
        (exclusions[j].person2 === id1 || exclusions[j].person2 === id2)){
          return false
        }
    }
  }
  let id1 = array[array.length - 1].id
  let id2 = array[0].id
  for (let j = 0; j < exclusions; j++){
    if ((exclusions[j].person1 === id1 || exclusions[j].person1 === id2) &&
      (exclusions[j].person2 === id1 || exclusions[j].person2 === id2)){
        return false
      }
  }
  return true
}

function shuffle(array) {
  console.log("shuffling array")

  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

  }

  return array;
}
