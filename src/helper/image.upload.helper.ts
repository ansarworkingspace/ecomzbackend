// imageUpload.service.ts
import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";

export const imageUploadService = async (
  files: UploadedFile[]
): Promise<{ success: boolean; data?: { urls: string[] }; error?: any }> => {
  try {
    const uploadPromises = files.map(async (file) => {
      // Check if file has required properties
      if (!file || !file.data) {
        throw new Error(`Invalid file: Missing file data`);
      }

      // Validate file type (use mimetype if available, otherwise check file extension)
      const isValidImage = file.mimetype
        ? file.mimetype.startsWith("image/")
        : file.name && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.name);

      if (!isValidImage) {
        throw new Error(
          `Invalid file type: ${
            file.mimetype || "unknown"
          }. Only images are allowed.`
        );
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size && file.size > maxSize) {
        throw new Error(
          `File size too large: ${file.size} bytes. Maximum 10MB allowed.`
        );
      }

      // Determine mimetype if not present
      let mimetype = file.mimetype;
      if (!mimetype && file.name) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        switch (ext) {
          case "jpg":
          case "jpeg":
            mimetype = "image/jpeg";
            break;
          case "png":
            mimetype = "image/png";
            break;
          case "gif":
            mimetype = "image/gif";
            break;
          case "webp":
            mimetype = "image/webp";
            break;
          default:
            mimetype = "image/jpeg"; // Default fallback
        }
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${mimetype || "image/jpeg"};base64,${file.data.toString(
          "base64"
        )}`,
        {
          folder: "ecomz", // Optional: organize uploads in folders
          resource_type: "image",
          quality: "auto:good", // Optimize quality
          fetch_format: "auto", // Auto-optimize format
        }
      );

      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);

    return {
      success: true,
      data: {
        urls,
      },
    };
  } catch (error: any) {
    console.error("Error in imageUploadService:", error);

    // Handle specific Cloudinary errors
    if (error.http_code) {
      return {
        success: false,
        error: {
          code: "CLOUDINARY_ERROR",
          message: error.message || "Cloudinary upload failed",
          statusCode: error.http_code || 500,
        },
      };
    }

    // Handle validation errors
    if (
      error.message.includes("Invalid file type") ||
      error.message.includes("File size too large")
    ) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.message,
          statusCode: 400,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "UPLOAD_ERROR",
        message: "Failed to upload images",
        statusCode: 500,
      },
    };
  }
};
