const Product = require('../models/Product');
const User = require('../models/userModel');
const stripe = require('stripe')('sk_test_51P93F1SEesVIE0tAN9K4zZMcU9OQkQgFrF3HzOKffywgEzuhnKjNqXrPuoqVn09gKVn1wCLZxOfsI0HTAPqSMtVy008quRHae3')

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('ecom_product_grid', { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addProductForm = (req, res) => {
  res.render('add_product');
};

exports.addProduct = async (req, res) => {
  const { name, rating, discount, price, description, productCode, brand, tags } = req.body;
  const availability = req.body.availability === 'on';
  const images = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const newProduct = new Product({
      name,
      images,
      rating,
      discount,
      price,
      description,
      availability,
      productCode,
      brand,
      tags: tags.split(',')
    });
    await newProduct.save();
    res.redirect('/ecom_product_grid');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('ecom_checkout', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('ecom_product_details', { product });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.editProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('add_product', { product });
}

exports.postEditProduct = async (req, res) => {
  const { name, price, rating, discount, description, availability, productCode, brand, tags } = req.body;
  const images = req.file ? `/uploads/${req.file.filename}` : '';

  const updatedProduct = {
    name,
    price,
    rating,
    discount,
    description,
    availability: availability === 'on',
    productCode,
    brand,
    images,
    tags: tags.split(',').map(tag => tag.trim())
  };

  if (req.file) {
    updatedProduct.images = req.file.path;
  }

  await Product.findByIdAndUpdate(req.params.id, updatedProduct);
  res.redirect('/ecom_product_grid');
}

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/ecom_product_grid');
}

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    const productExists = user.cart.some(item => item.productId.toString() === productId);
    if (productExists) {
      await User.updateOne(
        { _id: req.user.id, 'cart.productId': productId },
        { $inc: { 'cart.$.quantity': 1 } }
      );
    } else {
      user.cart.push({ productId, quantity: 1 });
      await user.save();
    }

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.render('cart', {
      cart: user.cart,req:req
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.payment = async(req,res) =>{
  const {price,email,pk} = req.body;
  const Total = parseFloat(price) * 100; 

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Payment',
          },
          unit_amount: Math.round(Total)
        },
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/ecom_product_order`,
    cancel_url: `http://localhost:3000/page_error_400`,
    customer_email: email,
    metadata: {
      publisher_key: pk
    }
  })
  res.redirect(session.url)
}