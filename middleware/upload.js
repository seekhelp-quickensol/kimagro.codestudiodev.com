const multer = require("multer");
const path = require("path");
const fs = require("fs");
const generateFilename = require("../utils/generateFileName");

const getUploader = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const mime = file.mimetype;
      let subfolder = "uploads/services";

      if (mime.startsWith("image/")) {
        subfolder = "uploads/images";
      } else if (
        mime === "application/pdf" ||
        mime === "application/msword" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        subfolder = "uploads/brochures";
      } else if (
        mime === "video/mp4" ||
        mime === "video/quicktime" ||
        mime === "video/x-msvideo"
      ) {
        subfolder = "uploads/videos";
      }

      const uploadPath = path.join(__dirname, "..", subfolder);

      try {
        fs.mkdirSync(uploadPath, { recursive: true });
      } catch (err) {
        console.error("Error creating directory:", err);
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const userId = req.user?.id || "guest";
      const uniqueName = generateFilename(file.originalname, userId);
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type: " + file.mimetype));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  });
};

module.exports = getUploader;
