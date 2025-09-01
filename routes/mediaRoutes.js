const express = require("express");
const router = express.Router();

const {
  getAjaxMedias,
  createMedia,
  getMediaById,
  updateMedia,
  getAllcategoryMaster,
  deleteMedia,
  uniqueEnCategory,
} = require("../controllers/admin/mediaMasterController");
const {
  mediaMasterValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");

router.get("/medias", getAllcategoryMaster);
router.get("/get-media/:id", authenticateAdmin, getMediaById);
router.post(
  "/add-media-master",
  authenticateAdmin,
  mediaMasterValidationRules,
  validateRequest,
  createMedia
);
router.put(
  "/add-media-master/:id",
  authenticateAdmin,
  mediaMasterValidationRules,
  validateRequest,
  updateMedia
);
router.delete("/delete-media/:id", authenticateAdmin, deleteMedia);

router.post("/ajax/media-list", getAjaxMedias);

router.get("/check-unique", uniqueEnCategory);

module.exports = router;
