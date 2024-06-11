const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  discount: Number,
  price: Number,
  rating: Number,
  availability: Boolean,
  productCode: String,
  brand: String,
  tags: [String],
  description: String,
  images: [String]  // Array of image URLs
});

module.exports = mongoose.model('Product', productSchema);
