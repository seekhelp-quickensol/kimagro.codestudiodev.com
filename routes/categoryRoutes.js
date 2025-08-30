const express = require("express");
const router = express.Router();

const {
  getAjaxCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/admin/categoryController");
const {
  categoryValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const { getCategories } = require("../controllers/front/categoryController");
// const upload = require('../middleware/upload');
const upload = require("../middleware/upload")("uploads/services");

router.get("/categories", getAllCategories);
router.get("/get-category/:id", authenticateAdmin, getCategoryById);
router.post(
  "/add-category",
  authenticateAdmin,
  upload.single("upload_img"),
  categoryValidationRules, 
  validateRequest,
  createCategory
);
router.put(
  "/add-category/:id",
  authenticateAdmin,
  upload.single("upload_img"),
  categoryValidationRules,
  validateRequest,
  updateCategory
);
router.delete("/delete-category/:id", authenticateAdmin, deleteCategory);

router.post("/ajax/category-list", getAjaxCategories);


router.get("/all-categories", getCategories);

module.exports = router;
