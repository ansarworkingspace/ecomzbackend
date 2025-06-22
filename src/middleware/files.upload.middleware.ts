import fileUpload from "express-fileupload";

export const fileUploadMiddleware = fileUpload({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 4, // Maximum 4 files
  },
  abortOnLimit: true,
  responseOnLimit: "File size or count limit exceeded",
});