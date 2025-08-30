const multer = require("multer");
const path = require("path");
const fs = require("fs");
const validateFileTypeVideo = require("../utils/validateFileTypeVideo");
const generateFilename = require("../utils/generateFileName");

const videoUpload = (folder = "uploads/videos") => {
  const absoluteFolderPath = path.resolve(__dirname, "..", folder);

  if (!fs.existsSync(absoluteFolderPath)) {
    fs.mkdirSync(absoluteFolderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, absoluteFolderPath);
    },

    filename: (req, file, cb) => {
      try {
        const userId = req.user?.id || "video";
        const uniqueName = generateFilename(file.originalname, userId);
        cb(null, uniqueName);
      } catch (err) {
        cb(err);
      }
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = validateFileTypeVideo(file.originalname, ["mp4", "mov", "avi"]);
    if (allowed) {
      cb(null, true);
    } else {
      cb(new Error("Only MP4, MOV, and AVI video files are allowed"));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: Number(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024, 
    },
  });
};

module.exports = videoUpload;