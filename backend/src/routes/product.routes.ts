import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller'

const router = express.Router()

router.use(authMiddleware)
router.get('/product', getProducts)
router.get('/product/:id', getProductById)
router.post('/product', createProduct)
router.put('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

export default router
