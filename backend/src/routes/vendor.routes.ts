import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorInvoices,
  getVendorInvoiceById,
  createVendorInvoice,
  updateVendorInvoice,
  deleteVendorInvoice,
} from '../controllers/vendor.controller'

const router = express.Router()

router.use(authMiddleware)
router.get('/vendor', getVendors)
router.get('/vendor/:id', getVendorById)
router.post('/vendor', createVendor)
router.put('/vendor/:id', updateVendor)
router.delete('/vendor/:id', deleteVendor)
router.get('/vendor-invoice', getVendorInvoices)
router.get('/vendor-invoice/:id', getVendorInvoiceById)
router.post('/vendor-invoice', createVendorInvoice)
router.put('/vendor-invoice/:id', updateVendorInvoice)
router.delete('/vendor-invoice/:id', deleteVendorInvoice)

export default router
