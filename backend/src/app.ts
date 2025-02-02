import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes'
import quotationRoutes from './routes/quotation.routes'
import morganMiddleware from './middleware/morgan.middleware'
import logger from './config/logger'

dotenv.config()
const app = express()

logger.info('Application Starting...')

app.use(morganMiddleware)
app.use(helmet())
app.use(express.json())
app.use('/api', authRoutes)
app.use('/api', quotationRoutes)

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error('Error:', err)
    res.status(500).send('Something broke!')
  },
)

logger.info('Routes loaded')

export default app
