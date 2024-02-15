const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerDetails: {
        type: Object
    },
    lineItems: 
    { 
        type: Array, 
    }
    ,
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);