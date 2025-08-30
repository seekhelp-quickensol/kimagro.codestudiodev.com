const express = require("express");
const router = express.Router();

const {
  getAjaxMediaModules,
  getMediaModuleById,
  createMediaModule,
  updateMediaModule,
  deleteMediaModule,
  getAllMediaModules,
} = require("../controllers/admin/medModuleController");
const {
  mediaModuleValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const {
  getMediaData,
  getMediaByCategory,
} = require("../controllers/front/customMediaController");
const upload = require("../middleware/upload")("uploads/images");

router.get("/medmodules", getAllMediaModules);
router.get("/get-media-module/:id", authenticateAdmin, getMediaModuleById);
router.post(
  "/add-media",
  authenticateAdmin,
  upload.fields([
    { name: "upload_photo", maxCount: 1 },
    { name: "upload_thumbnail", maxCount: 1 },
    { name: "upload_video", maxCount: 1 },
  ]),
  mediaModuleValidationRules,
  validateRequest,
  createMediaModule
);
router.put(
  "/add-media/:id",
  authenticateAdmin,
  upload.fields([
    { name: "upload_photo", maxCount: 1 },
    { name: "upload_thumbnail", maxCount: 1 },
    { name: "upload_video", maxCount: 1 },
  ]),
  mediaModuleValidationRules,
  validateRequest,
  updateMediaModule
);

router.delete("/delete-media-module/:id", authenticateAdmin, deleteMediaModule);

router.post("/ajax/media-list", getAjaxMediaModules);

router.get("/media", getMediaData);
router.get("/category/:categoryId", getMediaByCategory);

module.exports = router;
