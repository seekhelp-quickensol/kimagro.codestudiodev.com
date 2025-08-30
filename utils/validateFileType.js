
const validateFileType = (fileName) => {
  const ext = require("path").extname(fileName).toLowerCase();
  return [".jpg", ".jpeg", ".png"].includes(ext);
};

module.exports = validateFileType;

