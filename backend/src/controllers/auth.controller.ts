import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../config/db'
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from '../utils/jwt'
import jwt from 'jsonwebtoken'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/email.service'
import logger from '../config/logger'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body

  if (!email || !password || !name) {
    logger.error('All fields are required')
    res.status(400).json({ message: 'All fields are required' })
    return
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    logger.error('User already exists')
    res.status(400).json({ message: 'User already exists' })
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = generateVerificationToken() // Generate token verifikasi

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        verificationToken, // Simpan token verifikasi
        verifyExpires: new Date(Date.now() + 15 * 60 * 1000), // Token berlaku 15 menit
      },
    })

    await sendVerificationEmail(email, verificationToken) // Kirim email verifikasi

    logger.info('User registered successfully')
    res.json({
      message:
        'User registered successfully. Please check your email to verify your account.',
    })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    logger.error('Email and password are required')
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error('Invalid credentials')
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    if (!user.isVerified) {
      logger.error('Email is not verified')
      res.status(400).json({ message: 'Email is not verified' })
      return
    }

    const accessToken = generateAccessToken(
      user.id,
      user.role,
      user.name,
      user.email,
    )
    const refreshToken = generateRefreshToken(
      user.id,
      user.role,
      user.name,
      user.email,
    )
    logger.info('User logged in successfully')
    res.json({ accessToken, refreshToken })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    logger.error('Refresh token is required')
    res.status(400).json({ message: 'Refresh token is required' })
    return
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { userId: string; role: string }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })

    if (!user) {
      logger.error('Invalid refresh token')
      res.status(401).json({ message: 'Invalid refresh token' })
      return
    }

    const newAccessToken = generateAccessToken(
      user.id,
      user.role,
      user.name,
      user.email,
    )
    logger.info('Access token refreshed successfully')
    res.json({ accessToken: newAccessToken })
  } catch (error) {
    logger.error('Invalid refresh token')
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const requestEmailVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body

  if (!email) {
    logger.error('Email is required')
    res.status(400).json({ message: 'Email is required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      logger.error('User not found')
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (user.isVerified) {
      logger.error('Email is already verified')
      res.status(400).json({ message: 'Email is already verified' })
      return
    }

    const token = generateVerificationToken() // Generate token baru
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: token,
        verifyExpires: new Date(Date.now() + 15 * 60 * 1000), // Token berlaku 15 menit
      },
    })

    await sendVerificationEmail(email, token) // Kirim email verifikasi
    logger.info('Verification email sent')
    res.json({ message: 'Verification email sent' })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.query.token as string

  if (!token) {
    logger.error('Token is required')
    res.status(400).json({ message: 'Token is required' })
    return
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verifyExpires: { gt: new Date() }, // Cek apakah token masih berlaku
      },
    })

    if (!user) {
      logger.error('Invalid or expired token')
      res.status(400).json({ message: 'Invalid or expired token' })
      return
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null, // Hapus token setelah verifikasi
        verifyExpires: null, // Hapus waktu kedaluwarsa
      },
    })
    logger.info('Email verified successfully')
    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    logger.error('Invalid token')
    res.status(400).json({ message: 'Invalid token' })
  }
}

export const requestPasswordReset = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body

  if (!email) {
    logger.error('Email is required')
    res.status(400).json({ message: 'Email is required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      logger.error('User not found')
      res.status(404).json({ message: 'User not found' })
      return
    }

    const resetToken = generateVerificationToken()
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetToken,
        resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000), // Token berlaku 15 menit
      },
    })

    await sendPasswordResetEmail(email, resetToken)
    logger.info('Password reset email sent')
    res.json({ message: 'Password reset email sent' })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.query.token as string
  const { newPassword } = req.body

  if (!token || !newPassword) {
    logger.error('Token and new password are required')
    res.status(400).json({ message: 'Token and new password are required' })
    return
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() }, // Cek apakah token masih berlaku
      },
    })

    if (!user) {
      logger.error('Invalid or expired token')
      res.status(400).json({ message: 'Invalid or expired token' })
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null, // Hapus token setelah reset
        resetTokenExpires: null, // Hapus waktu kedaluwarsa
      },
    })
    logger.info('Password reset successfully')
    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    logger.error('Invalid token')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
