const Product = require('../models/Product');
const User = require('../models/userModel');
const Order = require('../models/OrderModel');
const stripe = require('stripe')('sk_test_51P93F1SEesVIE0tAN9K4zZMcU9OQkQgFrF3HzOKffywgEzuhnKjNqXrPuoqVn09gKVn1wCLZxOfsI0HTAPqSMtVy008quRHae3');

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('ecom_product_grid', { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Render add product form
exports.addProductForm = (req, res) => {
  res.render('add_product');
};

// Add new product
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

// Checkout and cart
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

// Get product details
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

// Edit product
exports.editProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('add_product', { product });
};

// Post edit product
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
};

// Delete product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/ecom_product_grid');
};

// Add to cart
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

// Get cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.render('cart', {
      cart: user.cart,
      req: req
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    // Log the order data for debugging
    console.log("Order data:", { items, shippingAddress, paymentMethod });
    
    req.session.orderData = { items, shippingAddress, paymentMethod }; // Set orderData in session
    
    // Save the session and log the session data
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Error saving session', error: err.message });
      }
      console.log("Session data after setting orderData:", req.session);
      res.redirect(`/payment`);
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


// Payment
exports.payment = async (req, res) => {
  const { price, email, pk } = req.body;
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
    success_url: `http://localhost:3000/ecom_product_order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/page_error_400`,
    customer_email: email,
    metadata: {
      publisher_key: pk
    }
  });
  res.redirect(session.url);
};


exports.successPayment = async (req, res) => {
  try {
    const session_id = req.query.session_id;
    // Log the session_id for debugging
    console.log("Session ID:", session_id);
    
    if (!session_id) {
      return res.status(400).send('session_id is missing');
    }
    
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
    // Log the Stripe session data for debugging
    console.log("Stripe session:", stripeSession);
    
    // Retrieve orderData from session
    const orderData = req.session.orderData;
    // Log the orderData for debugging
    console.log("Order Data from session:", orderData);
    
    if (!orderData) {
      return res.status(400).send('Order data is missing from session');
    }
    
    // Process the payment and create order
    // Add your payment processing and order creation logic here
    
    delete req.session.orderData;
    res.redirect(`/ecom_product_order/${order._id}`);
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};



// Get orders
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('products.product')
      .populate('user');

    res.render('ecom_product_order', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};