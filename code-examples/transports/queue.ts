export const processImageResize = pikkuSessionlessFunc<
  { imageUrl: string; sizes: number[]; userId: string },
  { processedImages: Array<{ size: number; url: string }> }
>(async ({ logger, imageService, storageService }, data) => {
  try {
    logger.info(`Processing image resize for user ${data.userId}`)
    
    const processedImages = []
    
    for (const size of data.sizes) {
      // Resize image to specified size
      const resizedBuffer = await imageService.resize(data.imageUrl, size)
      
      // Upload to storage
      const uploadedUrl = await storageService.upload({
        buffer: resizedBuffer,
        filename: `${data.userId}/resized_${size}px.jpg`,
        contentType: 'image/jpeg'
      })
      
      processedImages.push({ size, url: uploadedUrl })
    }
    
    logger.info(`Successfully processed ${processedImages.length} image sizes`)
    return { processedImages }
    
  } catch (error) {
    logger.error('Failed to process image:', error)
    throw error // Will trigger retry logic
  }
})

addQueueWorker({
  name: 'image-processing',
  func: processImageResize,
  concurrency: 3,
  retryOptions: {
    attempts: 3,
    backoff: 'exponential',
    delay: 2000,
  },
})