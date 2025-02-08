import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { handleUpload } from '../middleware/multer.middleware'
import {
  updateName,
  updateEmail,
  updatePassword,
  updateProfilePhoto,
  deleteProfilePhoto,
  getProfile,
  getUsers,
} from '../controllers/user.controller'

const router = express.Router()

router.use(authMiddleware)
router.put('/user/name', updateName)
router.put('/user/email', updateEmail)
router.put('/user/password', updatePassword)
router.put('/user/profile-photo', handleUpload, updateProfilePhoto)
router.delete('/user/profile-photo', deleteProfilePhoto)
router.get('/user/profile', getProfile)
router.get('/users', getUsers)

export default router
