const mongoose = require('mongoose');
const validator = require('validator');

const statSchema = new mongoose.Schema({
  months: [
    {
      name: { type: String, value: "Chiffre d'affaires"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "Bénéfices"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "Dépenses"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "TVA"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "Pub"},
      quantity:{ type: Number, value : 0},    
    },
  ],
 years: [
    {
      name: { type: String, value: "Chiffre d'affaires"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "Bénéfices"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "Dépenses"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "TVA"},
      quantity:{ type: Number, value : 0},    
    },
    {
      name: { type: String, value: "Pub"},
      quantity:{ type: Number, value : 0},    
    },
 ]
});

module.exports = mongoose.models.Stat || mongoose.model("Stat", statSchema);