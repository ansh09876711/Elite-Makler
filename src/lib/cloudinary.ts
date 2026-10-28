import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export { cloudinary }

/** Property image upload karo Cloudinary pe */
export async function uploadPropertyImage(
  filePath: string,
  propertySlug: string
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder:         `ELITE MAKLER/properties/${propertySlug}`,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  })
  return { url: result.secure_url, publicId: result.public_id }
}

/** Cloudinary URL se optimized URL banao */
export function getOptimizedUrl(publicId: string, width = 800, height = 600) {
  return cloudinary.url(publicId, {
    width,
    height,
    crop:         'fill',
    quality:      'auto',
    fetch_format: 'auto',
    secure:       true,
  })
}

