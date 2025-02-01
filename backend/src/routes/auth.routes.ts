import express from 'express'
import {
  register,
  login,
  refreshToken,
  requestEmailVerification,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller'
import { isAdmin, authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/auth/register', register)
router.post('/auth/login', login)
router.post('/auth/refresh-token', refreshToken)

router.post('/auth/request-verification', requestEmailVerification)
router.get('/auth/verify-email', verifyEmail)

router.post('/auth/request-password-reset', requestPasswordReset)
router.post('/auth/reset-password', resetPassword)

router.get('/admin', isAdmin, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id, role, name, email } = req.user
  res.json({ userId: id, role, name, email })
})

router.get('/profile', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id, role, name, email } = req.user
  res.json({ userId: id, role, name, email })
})

export default router
