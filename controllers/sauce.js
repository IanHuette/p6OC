const Sauce = require('../models/sauce');
const fs = require('fs');

/**
 * AFFICHER TOUTES LES SAUCES
 */
const getAllSauces = (req, res, next) => {
    Sauce.find() 
    .then(sauces => res.status(200).json(sauces)) 
    .catch(error => res.status(400).json({ error }));
};

/**
 * AFFICHER UNE SEULE SAUCE
 */
const getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/**
 * CRÉER UNE SAUCE
 */
const createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};

/**
 * MODIFIER UNE SAUCE
 */

const modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

/**
 * SUPPRIMER UNE SAUCE
 */
const deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id : req.params.id})
        .then(res.status(200).json({ message: "Sauce supprimée" }))
        .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
};

/**
 * LIKE / DISLIKE UNE SAUCE
 */
const likeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  switch (like) { /* on utilise switch pour comparer et agir sur les différentes possibilités */
    case 1 : /* possibilité du 1 */
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }}) /* on incrémente la valeur +1 à l'id qui like */
          .then(() => res.status(200).json({ message: `L'utilisateur a like la sauce` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 : /* possibilité du 0 */
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { /* si un user a déjà liké la sauce */
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }}) /* on incrémente la valeur -1 à l'id qui modifie son like ce qui donne la valeur 0 */
                .then(() => res.status(200).json({ message: `L'utilisateur a enlevé son like` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }}) /* on incrémente la valeur -1 à l'id qui modifie son dislike ce qui donne la valeur 0 */
                .then(() => res.status(200).json({ message: `L'utilisateur a enlevé son dislike` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 : /* possibilité du -1 */
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }}) /* on incrémente la valeur +1 à l'id qui dislike */
          .then(() => { res.status(200).json({ message: `L'utilisateur a dislike la sauce` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}



module.exports = {
    getAllSauces,
    getOneSauce,
    createSauce,
    modifySauce,
    deleteSauce,
    likeSauce
};