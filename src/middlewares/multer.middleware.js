import multer from 'multer'
import fs from "fs"
import path from "path"

const uploadDir = path.join(process.cwd(), "public", "temp")

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    fs.mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }

})

const baseUpload = multer({
  storage
})

const getUploadedPaths = (req) => {
  const filePaths = []

  if (req.file?.path) {
    filePaths.push(req.file.path)
  }

  if (Array.isArray(req.files)) {
    req.files.forEach((file) => {
      if (file?.path) filePaths.push(file.path)
    })
  } else if (req.files && typeof req.files === "object") {
    Object.values(req.files).forEach((files) => {
      if (Array.isArray(files)) {
        files.forEach((file) => {
          if (file?.path) filePaths.push(file.path)
        })
      }
    })
  }

  return [...new Set(filePaths)]
}

const unlinkUploadedFiles = async (req) => {
  const filePaths = getUploadedPaths(req)

  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        await fs.promises.unlink(filePath)
      } catch (error) {
        if (error?.code !== "ENOENT") {
          console.error("Failed to delete temp upload:", error)
        }
      }
    })
  )
}

const withAutoCleanup = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) return next(err)

      let cleanedUp = false
      const cleanupOnce = () => {
        if (cleanedUp) return
        cleanedUp = true
        unlinkUploadedFiles(req)
      }

      res.once("finish", cleanupOnce)
      res.once("close", cleanupOnce)

      next()
    })
  }
}

export const upload = {
  single: (fieldName) => withAutoCleanup(baseUpload.single(fieldName)),
  array: (fieldName, maxCount) => withAutoCleanup(baseUpload.array(fieldName, maxCount)),
  fields: (fields) => withAutoCleanup(baseUpload.fields(fields)),
  any: () => withAutoCleanup(baseUpload.any()),
  none: () => withAutoCleanup(baseUpload.none())
}
