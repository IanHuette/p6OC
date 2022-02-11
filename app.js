const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// connection à MongoDB
mongoose.connect(process.env.DB_CREDENTIALS,  //utilisation de env pour la sécurité. Permet de cacher la clé de connection mongoose.
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
// on dit explicitement à Express d'être capable de lire les JSON envoyés dans une requête
app.use(express.json());

// on autorise certains accès  (méthodes, origin, headers)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = {
  app,
  env
};