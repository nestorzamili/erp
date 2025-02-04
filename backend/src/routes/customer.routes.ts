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

router.use(authMiddleware)
router.get('/customer', getCustomers)
router.get('/customer/:id', getCustomer)
router.post('/customer', createCustomer)
router.put('/customer/:id', updateCustomer)
router.delete('/customer/:id', deleteCustomer)

export default router
