import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
}

export const uploadToCloudinary = async (
  buffer: Buffer,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile-photos',
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed'))
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
        })
      },
    )

    const readableStream = new Readable({
      read() {
        this.push(buffer)
        this.push(null)
      },
    })

    readableStream.pipe(uploadStream)
  })
}

export const getOptimizedUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
  })
}

// create optimized url for logo with public id "My Brand/navindo-logo"
export const optimizedLogoUrl = getOptimizedUrl('My Brand/navindo-logo')
