const express = require("express");
const router = express.Router();

const {
  getAjaxInnovations,
  getAllInnovations,
  geInnovationById,
  createInnovation,
  updateInnovation,
  deleteInnovation,
  getInnovationDataById,
} = require("../controllers/admin/innovationController");
const {
  innovationValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const upload = require("../middleware/upload")("uploads/services");

router.get("/innovations", getAllInnovations);
router.get("/innovation-by-product/:productId", geInnovationById);
router.get("/get-innovation/:id", getInnovationDataById);
router.post(
  "/add-innovation",
  authenticateAdmin,
  upload.fields([
    { name: "upload_icon", maxCount: 1 },
    { name: "upload_img", maxCount: 1 },
  ]),
  innovationValidationRules,
  validateRequest,
  createInnovation
);
router.put(
  "/add-innovation/:id",
  authenticateAdmin,
  upload.fields([
    { name: "upload_icon", maxCount: 1 },
    { name: "upload_img", maxCount: 1 },
  ]),
  innovationValidationRules,
  validateRequest,
  updateInnovation
);
router.delete("/delete-innovation/:id", authenticateAdmin, deleteInnovation);

router.post("/ajax/innovation-list", getAjaxInnovations);

module.exports = router;
