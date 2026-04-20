import multer from "multer";

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    // it takes files in bytes so
    // 1024 bytes = 1 kb and 1024kb = 1 mb
  },
});
