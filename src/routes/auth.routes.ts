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
import { emailRateLimiter } from '../middleware/rateLimit'

const router = express.Router()

// Authentication routes with logging
router.post('/auth/register', register)
router.post('/auth/login', login)
router.post('/auth/refresh-token', refreshToken)

// Email verification routes
router.post(
  '/auth/request-verification',
  emailRateLimiter,
  requestEmailVerification,
)
router.get('/auth/verify-email', verifyEmail)

// Password reset routes
router.post('/auth/request-password-reset', requestPasswordReset)
router.post('/auth/reset-password', resetPassword)

export default router
