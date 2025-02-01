import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../config/db'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import jwt from 'jsonwebtoken'

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

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || 'user' },
    })

    res.json({ message: 'User registered successfully' })
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
