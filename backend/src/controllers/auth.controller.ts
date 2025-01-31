import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../config/db'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
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
      data: { email, password: hashedPassword },
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

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.json({ accessToken, refreshToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
