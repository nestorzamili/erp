import rateLimit from 'express-rate-limit'

export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many requests, please try again later.',
})
