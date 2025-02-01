import jwt from 'jsonwebtoken'

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
