const express = require("express");
const router = express.Router();

const {
  getAjaxSKUS,
  createSKU,
  getSKUById,
  updateSKU,
  getAllskus,
  getAllDistinctUnits,
  deleteSKU,
  uniqueSKU
} = require("../controllers/admin/skuController");
const {
  skuValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");

router.get("/skus", getAllskus);
router.get("/units", getAllDistinctUnits);
router.get("/get-sku/:id", authenticateAdmin, getSKUById);
router.post(
  "/add-sku-master",
  authenticateAdmin,
  skuValidationRules,
  validateRequest,
  createSKU
);
router.put(
  "/add-sku-master/:id",
  authenticateAdmin,
  skuValidationRules,
  validateRequest,
  updateSKU
);
router.delete("/delete-sku/:id", authenticateAdmin, deleteSKU);

router.post("/ajax/sku-list", getAjaxSKUS);

router.get("/check-unique", uniqueSKU);

module.exports = router;
