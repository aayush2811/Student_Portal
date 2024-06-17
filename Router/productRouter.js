const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const upload = require('../middleware/multer');
const middleware = require('../middleware/authMiddleware');

// Fetch all products
router.get('/ecom_product_grid', productController.getProducts);

// Render add product form
router.get('/ecom_product_grid/add', productController.addProductForm);

// Add new product
router.post('/ecom_product_grid/add', upload.single('image'), productController.addProduct);

// Get product details
router.get('/ecom_product_details/:id', productController.getProductDetails);

// Edit product
router.get('/ecom_product_grid/edit/:id', productController.editProduct);
router.post('/ecom_product_grid/edit/:id', productController.postEditProduct);

// Checkout and cart
router.get('/ecom_checkout', middleware, productController.checkout);
router.get('/cart', middleware, productController.getCart);

// Delete product
router.post('/ecom_product_grid/delete/:id', productController.deleteProduct);

// Add to cart
router.post('/add-to-cart', middleware, productController.addToCart);

// Payment
router.post('/payment', middleware, productController.payment);
router.get('/ecom_product_order/success', middleware, productController.successPayment);

// Order
router.post('/ecom_product_order', middleware, productController.createOrder);
router.get('/ecom_product_order', middleware, productController.getOrders);


module.exports = router;
