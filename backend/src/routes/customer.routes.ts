import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customer.controller'

const router = express.Router()

// Customer routes
router.get('/customer', authMiddleware, getCustomers)
router.get('/customer/:id', authMiddleware, getCustomer)
router.post('/customer', authMiddleware, createCustomer)
router.put('/customer/:id', authMiddleware, updateCustomer)
router.delete('/customer/:id', authMiddleware, deleteCustomer)

export default router
