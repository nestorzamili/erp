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
import logger from '../config/logger'

const router = express.Router()

// Authentication routes with logging
router.post('/auth/register', (req, res, next) => {
  logger.info(`Registration attempt for email: ${req.body.email}`)
  register(req, res).catch((error) => {
    logger.error(`Registration failed for email: ${req.body.email}`, {
      error: error.message,
    })
    next(error)
  })
})

router.post('/auth/login', (req, res, next) => {
  logger.info(`Login attempt for email: ${req.body.email}`)
  login(req, res).catch((error) => {
    logger.error(`Login failed for email: ${req.body.email}`, {
      error: error.message,
    })
    next(error)
  })
})

router.post('/auth/refresh-token', (req, res, next) => {
  logger.info('Token refresh attempt')
  refreshToken(req, res).catch((error) => {
    logger.error('Token refresh failed', { error: error.message })
    next(error)
  })
})

// Email verification routes
router.post('/auth/request-verification', (req, res, next) => {
  logger.info(`Email verification requested for: ${req.body.email}`)
  requestEmailVerification(req, res).catch((error) => {
    logger.error(`Email verification request failed for: ${req.body.email}`, {
      error: error.message,
    })
    next(error)
  })
})

router.get('/auth/verify-email', (req, res, next) => {
  const token = req.query.token as string
  logger.info('Email verification attempt', {
    token: token.substring(0, 10) + '...',
  })
  verifyEmail(req, res).catch((error) => {
    logger.error('Email verification failed', { error: error.message })
    next(error)
  })
})

// Password reset routes
router.post('/auth/request-password-reset', (req, res, next) => {
  logger.info(`Password reset requested for email: ${req.body.email}`)
  requestPasswordReset(req, res).catch((error) => {
    logger.error(`Password reset request failed for: ${req.body.email}`, {
      error: error.message,
    })
    next(error)
  })
})

router.post('/auth/reset-password', (req, res, next) => {
  logger.info('Password reset attempt')
  resetPassword(req, res).catch((error) => {
    logger.error('Password reset failed', { error: error.message })
    next(error)
  })
})

// Protected routes
router.get('/admin', isAdmin, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id, role, name, email } = req.user
  logger.info(`Admin access successful for user: ${email}`)
  res.json({ userId: id, role, name, email })
})

router.get('/profile', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id, role, name, email } = req.user
  logger.info(`Profile accessed by user: ${email}`)
  res.json({ userId: id, role, name, email })
})

export default router
