import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const generateAccessToken = (
  userId: string,
  role: string,
  name: string,
  email: string,
) => {
  return jwt.sign({ userId, role, name, email }, JWT_SECRET, {
    expiresIn: '15m',
  })
}

export const generateRefreshToken = (
  userId: string,
  role: string,
  name: string,
  email: string,
) => {
  return jwt.sign({ userId, role, name, email }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })
}

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex') // Generate token acak 32 byte
}
