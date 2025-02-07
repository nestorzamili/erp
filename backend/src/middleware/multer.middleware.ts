import multer from 'multer'

const storage = multer.memoryStorage()

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Not an image! Please upload an image.'))
    }
  },
}).single('photo')

export const handleUpload = (req: any, res: any, next: any) => {
  uploadMiddleware(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: 'File upload error: ' + err.message })
    } else if (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}
