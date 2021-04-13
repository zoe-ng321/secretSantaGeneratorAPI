const User = require('../models/user.model.js');
const Group = require('../models/group.model.js');

exports.createGroup = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "No content"
        });
    }

    // Create a group
    const group = new Group({
      name: req.body.name,
      members: [req.body.userId],
      creatorId: req.body.userId,
      isAssigned: false,
      signUpEndDate: req.body.signUpEndDate,
      endDate: req.body.endDate,
      exclusions: []
    });

    // Save group in the database
    group.save()
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

exports.joinGroup = async(req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }

  await Group.findByIdAndUpdate(req.body._id,
      { "$push": { "members": req.body.newMemberId}},
      { "new": true, "upsert": true }
  ).catch(error => {
    return res.status(500).send(error);
  });

}

exports.findGroup = async(req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }

  let group = await Group.findOne({
    _id: req.body._id
  })

  if(!group){
    return res.status(400).json({
      type: "Not Found",
      msg: "User not found"
    })
  }else{
    return res.status(200).json({
      msg: "group found",
      data: group
    })
  }

}

exports.addExclusion = async(req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }

  const exclusion = {
    person1: req.body.id1,
    person2: req.body.id2
  }

  await Group.findByIdAndUpdate(req.body._id,
      { "$push": { "exclusions": exclusion}},
      { "new": true, "upsert": true }
  ).catch(error => {
    return res.status(500).send(error);
  });

}

exports.generatePairings = async(req, res) => {
  if(!req.body) {
      return res.status(400).send({
          message: "No content"
      });
  }

  let group = await Group.findOne({
    _id: req.body._id
  })

  if (!group){
    return res.status(404).send({
        message: "Not found"
    });
  }

  let memberArray = [...group.members]
  let exclusionArray = group.exclusions

  let shuffledArray = shuffle(memberArray)
  while (!checkExclusions(shuffledArray, exclusionArray)){
    shuffledArray = shuffle(memberArray)
  }

  let giftArray = []

  for (let i = 0; i < shuffledArray.length-1; i++){
    giftArray.push({gifter: shuffledArray[i], giftee: shuffledArray[i+1]})
  }
  giftArray.push({gifter: shuffledArray[shuffledArray.length-1], giftee: shuffledArray[0]})

  await Group.updateOne({_id: req.body._id}, {}).catch(error => {
    return res.status(500).send(error);
  });

  return res.status(200).json({
    message : "Generated pairings"
  });
}

function checkExclusions(array, exclusions){
  for (let i = 0; i < array.length-1; i++){
    let id1 = array[i]
    let id2 = array[i+1]
    for (let j = 0; j < exclusions; j++){
      if ((exclusions[j].person1 === id1 || exclusions[j].person1 === id2) &&
        (exclusions[j].person2 === id1 || exclusions[j].person2 === id2)){
          return true
        }
    }
  }
  let id1 = array[array.length - 1]
  let id2 = array[0]
  for (let j = 0; j < exclusions; j++){
    if ((exclusions[j].person1 === id1 || exclusions[j].person1 === id2) &&
      (exclusions[j].person2 === id1 || exclusions[j].person2 === id2)){
        return true
      }
  }
  return false
}

function shuffle(array) {
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
