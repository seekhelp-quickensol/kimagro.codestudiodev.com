// utils/generateFilename.js
const { v4: uuidv4 } = require("uuid");

const generateFilename = (originalName, userId = "anonymous") => {
  const ext = require("path").extname(originalName);
  const base = require("path")
    .basename(originalName, ext)
    .replace(/\s+/g, "-")
    .toLowerCase();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uuid = uuidv4();

  return `${userId}-${base}-${timestamp}-${uuid}${ext}`;
};

module.exports = generateFilename;