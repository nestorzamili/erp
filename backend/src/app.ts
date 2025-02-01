import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes'

dotenv.config()
const app = express()

app.use(helmet())
app.use(express.json())
app.use('/api', authRoutes)

export default app
