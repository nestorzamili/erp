import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  approveQuotation,
  updateQuotation,
  deleteQuotation,
  rejectQuotation,
  generateQuotationPdf,
} from '../controllers/quotation.controller'

const router = express.Router()

router.use(authMiddleware)
router.get('/quotation', getQuotations)
router.get('/quotation/:quotationId', getQuotationById)
router.post('/quotation', createQuotation)
router.put('/quotation/:quotationId', updateQuotation)
router.delete('/quotation/:quotationId', deleteQuotation)
router.put('/quotation/:quotationId/approve', approveQuotation)
router.put('/quotation/:quotationId/reject', rejectQuotation)
router.get('/quotation/:quotationId/export-pdf', generateQuotationPdf)

export default router
