const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Product Schema
const productSchema = new Schema({
  name: { type: String, required: true },
  //category: {},
  price: { type: Number, required: true },
  product_name: { type: String, required: true , unique: true },
  genderRestriction: { 
    type: String, 
    enum: ['male', 'female','all'], 
    default: 'all' ,
  },
  product_sku: { type: String, unique: true, required: true },
  description: { type: String }
}, { timestamps: true });

const Product = model('Product', productSchema);
module.exports = Product;
