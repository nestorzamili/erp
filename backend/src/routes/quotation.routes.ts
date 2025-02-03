import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  createQuotation,
  getAllQuotations,
  getQuotation,
  approveQuotation,
  editQuotation,
  deleteQuotation,
  rejectQuotation,
  generateQuotationPdf,
} from '../controllers/quotation.controller'

const router = express.Router()

router.use(authMiddleware)
router.post('/quotations', createQuotation)
router.get('/quotations', getAllQuotations)
router.get('/quotations/:quotationId', getQuotation)
router.put('/quotations/:quotationId', editQuotation)
router.delete('/quotations/:quotationId', deleteQuotation)
router.put('/quotations/:quotationId/approve', approveQuotation)
router.put('/quotations/:quotationId/reject', rejectQuotation)
router.get('/quotations/:quotationId/export-pdf', generateQuotationPdf)

export default router
