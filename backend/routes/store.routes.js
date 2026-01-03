import express from 'express';
import {
  getProducts,
  getProduct,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
  getOrders,
  getCategories
} from '../controllers/store.controllers.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);

// Protected routes (require authentication)
router.get('/cart', authMiddleware, getCart);
router.post('/cart', authMiddleware, addToCart);
router.put('/cart/:id', authMiddleware, updateCartItem);
router.delete('/cart/:id', authMiddleware, removeFromCart);
router.post('/checkout', authMiddleware, checkout);
router.get('/orders', authMiddleware, getOrders);

export default router;
