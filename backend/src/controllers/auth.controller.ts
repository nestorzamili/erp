import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../config/db'
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from '../utils/jwt'
import jwt from 'jsonwebtoken'
import { sendVerificationEmail } from '../services/email.service'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body

  if (!email || !password || !name) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
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

    res.json({
      message:
        'User registered successfully. Please check your email to verify your account.',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    if (!user.isVerified) {
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

    res.json({ accessToken, refreshToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken } = req.body

  if (!refreshToken) {
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
      res.status(401).json({ message: 'Invalid refresh token' })
      return
    }

    const newAccessToken = generateAccessToken(
      user.id,
      user.role,
      user.name,
      user.email,
    )

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const requestEmailVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ message: 'Email is required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (user.isVerified) {
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

    res.json({ message: 'Verification email sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.query.token as string

  if (!token) {
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

    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Invalid token' })
  }
}
