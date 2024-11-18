const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Product Schema
const productSchema = new Schema({
  nbr_product: { type: String, unique: true },
  name: { type: String, required: true },
  selling_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  product_sku: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  facebook_url: {type: String},
  youtube_url: {type: String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Product = model('Product', productSchema);
module.exports = Product;
