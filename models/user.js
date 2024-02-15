const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(v) {
      if (!validator.isEmail(v)) throw new Error('E-mail non valide !');
    } 
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return validator.isLength(v, { min: 10 });
      },
      message: 'Le mot de passe doit contenir au moins 10 caractères.'
    }
  },
  statut: {
    type: String,
    default: "moderator"
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);