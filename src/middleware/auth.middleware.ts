import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'
import logger from '../config/logger'

const JWT_SECRET = process.env.JWT_SECRET as string

// Fungsi helper untuk memverifikasi token dan menambahkan req.user
const verifyToken = async (
  token: string,
): Promise<{
  userId: string
  role: string
  name: string
  email: string
  photoUrl: string
} | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      role: string
      name: string
      email: string
      photoUrl: string
    }
    return decoded
  } catch (error) {
    return null
  }
}

// Middleware untuk autentikasi umum
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    logger.error('Access denied. No token provided.')
    res.status(401).json({ message: 'Access denied. No token provided.' })
    return
  }

  const decoded = await verifyToken(token)
  if (!decoded) {
    logger.warn('Unauthorized access attempt to user route')
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  // Tambahkan data user ke req.user
  req.user = {
    id: decoded.userId,
    role: decoded.role,
    name: decoded.name,
    email: decoded.email,
    photoUrl: decoded.photoUrl,
  }

  next()
}

// Middleware untuk memeriksa apakah user adalah admin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    logger.error('Access denied. No token provided.')
    res.status(401).json({ message: 'Access denied. No token provided.' })
    return
  }

  const decoded = await verifyToken(token)
  if (!decoded) {
    logger.warn('Unauthorized access attempt to admin route')
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  // Tambahkan data user ke req.user
  req.user = {
    id: decoded.userId,
    role: decoded.role,
    name: decoded.name,
    email: decoded.email,
    photoUrl: decoded.photoUrl,
  }

  // Cari user di database
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!user || user.id !== decoded.userId) {
    logger.error('Invalid token')
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  // Periksa role user
  if (user.role !== 'admin') {
    logger.error('Access denied. Unauthorized user.')
    res.status(403).json({ message: 'Access denied. Unauthorized user.' })
    return
  }

  next()
}
