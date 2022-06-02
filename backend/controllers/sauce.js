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

exports.modifySauce = (req, res, next) => {
  const sauceId = req.params.id;
  const sauceUpdate = req.body;
  sauce
    .updateOne({ _id: sauceId }, { $set: sauceUpdate })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.deleteSauce = (req, res, next) => {
  const sauceId = req.params.id;
  sauce
    .findOne({ _id: sauceId })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink("./images/" + filename, (err) => {
        if (err) {
          console.log(err);
        }
      });
    })
    .catch((error) => res.status(404).json({ error: error }));
  sauce
    .deleteOne({ _id: sauceId })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error: error }));
};