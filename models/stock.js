const mongoose = require('mongoose');
const validator = require('validator');

const stockSchema = new mongoose.Schema({
 sockets: [
   {
    name: { type: String, value: "Chaussettes blanches"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes grises"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes noires"},
    quantity:{ type: Number, value : 0},   
  },
  {
    name: { type: String, value: "Chaussettes bleues"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes bleues ciel"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes vertes"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes violettes"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes rouges"},
    quantity:{ type: Number, value : 0},    
  },
  {
    name: { type: String, value: "Chaussettes oranges"},
    quantity:{ type: Number, value : 0},   
  },
  {
    name: { type: String, value: "Chaussettes jaunes fluo"},
    quantity:{ type: Number, value : 0},   
  },
],

 balms: [
  {
    name: { type: String, value: "Baume du tigre rouge"},
    quantity:{ type: Number, value : 0},   
  },
  {
    name: { type: String, value: "Baume du tigre blanc"},
    quantity:{ type: Number, value : 0},     
  },
 ]
});

module.exports = mongoose.models.Stock || mongoose.model("Stock", stockSchema);