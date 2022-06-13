const sauce = require("../models/sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
  sauce
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error: error }));
};

exports.createSauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const newSauce = new sauce({
    ...JSON.parse(req.body.sauce),
    imageUrl: url + "/images/" + req.file.filename,
  });
  newSauce
    .save()
    .then((sauce) => res.status(201).json(sauce))
    .catch((error) => res.status(400).json({ error: error }));
};

//Fonction pour delete une image
function deleteImage(id, res) {
  sauce
    .findOne({ _id: id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink("./images/" + filename, (err) => {
        if (err) {
          console.log(err);
        }
      });
    })
    .catch((error) => res.status(404).json({ error: error }));
}

exports.modifySauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const sauceId = req.params.id;
  const sauceUpdate = req.body;
  deleteImage(sauceId, res);
  sauce
    .updateOne(
      { _id: sauceId },
      { $set: sauceUpdate, imageUrl: url + "/images/" + req.file.filename }
    )
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.deleteSauce = (req, res, next) => {
  const sauceId = req.params.id;
  deleteImage(sauceId, res);
  sauce
    .deleteOne({ _id: sauceId })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  
  sauce
  .findOne({ _id: sauceId })
  .then((sauce) => {
    if (like === 1) {
      sauce.usersLiked.push(userId);
      sauce.likes++;
    }
    if (like === 0) {
      if (sauce.usersLiked.includes(userId)) {
          const indexUser = sauce.usersLiked.findIndex(u => u._id == userId)
          sauce.usersLiked.splice(indexUser, 1);
          sauce.likes--;
        } else {
          const indexUser = sauce.usersDisliked.findIndex(u => u._id == userId)
          sauce.usersDisliked.splice(indexUser, 1);
          sauce.dislikes--;
        }
      }
      if (like === -1) {
        sauce.usersDisliked.push(userId);
        sauce.dislikes++;
      }

      sauce
        .save()
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error: error }));
    })
    .catch((error) => res.status(404).json({ error: error }));
};
