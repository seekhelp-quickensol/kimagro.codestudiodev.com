const path = require("path");

const validateFileTypeVideo = (filename) => {
  const allowedVideoTypes = ["mp4", "mov", "avi"];
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  return allowedVideoTypes.includes(ext);
};

module.exports = validateFileTypeVideo;
