import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import quotationRoutes from './routes/quotation.routes'
import customerRoutes from './routes/customer.routes'
import productRoutes from './routes/product.routes'
import vendorRoutes from './routes/vendor.routes'
import userRoutes from './routes/user.routes'
import morganMiddleware from './middleware/morgan.middleware'
import logger from './config/logger'
import { authMiddleware } from './middleware/auth.middleware'

// Environment configuration
dotenv.config()
const isProd = process.env.NODE_ENV === 'production'
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['*']

const app = express()

// Basic middleware setup
app.use(morganMiddleware)
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: isProd ? ALLOWED_ORIGINS : true,
    credentials: true,
  }),
)

// CSRF configurationexit
const csrfConfig = {
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
}

// CSRF middleware
if (isProd) {
  const csrfProtection = csrf(csrfConfig)

  app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
    res.json({ csrfToken: req.csrfToken() })
  })

  app.use((req, res, next) => {
    const isExempt =
      req.path === '/api/csrf-token' ||
      req.path.startsWith('/api/auth/') ||
      req.method === 'GET'
    isExempt ? next() : csrfProtection(req, res, next)
  })
} else {
  app.use((req, res, next) => {
    req.csrfToken = () => 'dev-token'
    res.cookie('XSRF-TOKEN', 'dev-token', {
      httpOnly: true,
      sameSite: 'strict',
    })
    next()
  })
}

// Protected routes middleware
const isPublicPath = (path: string) =>
  path === '/csrf-token' || path.startsWith('/auth/')

app.use('/api', (req, res, next) =>
  isPublicPath(req.path) ? next() : authMiddleware(req, res, next),
)

// Routes
app.use('/api', authRoutes)
app.use('/api', quotationRoutes)
app.use('/api', customerRoutes)
app.use('/api', productRoutes)
app.use('/api', vendorRoutes)
app.use('/api', userRoutes)

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err.name === 'CsrfProtectionError') {
      return res.status(403).json({ message: 'Invalid CSRF token' })
    }
    logger.error('Error:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  },
)

logger.info('Routes loaded')

export default app
