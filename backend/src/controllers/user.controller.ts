import { Request, Response } from 'express'
import prisma from '../config/db'
import logger from '../config/logger'
import bcrypt from 'bcryptjs'
import { uploadToCloudinary, getOptimizedUrl } from '../utils/cloudinary'

export const updateName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name } = req.body

  if (!name) {
    logger.error('Name is required')
    res.status(400).json({ message: 'Name is required' })
    return
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
    })

    logger.info('Name updated successfully')
    res.json({ name: user.name })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateEmail = async (
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
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { email },
    })

    logger.info('Email updated successfully')
    res.json({ email: user.email })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updatePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { newPassword } = req.body

  if (!newPassword) {
    logger.error('New password is required')
    res.status(400).json({ message: 'New password is required' })
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    })

    logger.info('Password updated successfully')
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateProfilePhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' })
      return
    }

    const result = await uploadToCloudinary(req.file.buffer)

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { photoUrl: result.public_id },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
      },
    })

    res.json({
      message: 'Profile photo updated successfully',
      user: {
        ...user,
        photoUrl: user.photoUrl ? getOptimizedUrl(user.photoUrl) : null,
      },
    })
  } catch (error) {
    logger.error('Error updating profile photo:', error)
    res.status(500).json({ message: 'Error updating profile photo' })
  }
}

export const deleteProfilePhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { photoUrl: null },
    })

    logger.info('Profile photo deleted successfully')
    res.json({ message: 'Profile photo deleted successfully' })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

//  get user profile
export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
      },
    })

    if (!user) {
      logger.error('User not found')
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({
      user: {
        ...user,
        photoUrl: user.photoUrl ? getOptimizedUrl(user.photoUrl) : null,
      },
    })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

//  get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
      },
    })

    res.json({
      users: users.map((user) => ({
        ...user,
        photoUrl: user.photoUrl ? getOptimizedUrl(user.photoUrl) : null,
      })),
    })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
