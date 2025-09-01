const express = require("express");
const router = express.Router();

const {
  getAjaxproducts,
  createProudct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductByCategory,
  uniqueEnProduct,
  getProductDetails,
} = require("../controllers/admin/productController");
const {
  productValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const {
  getProductsByCategoryID,
} = require("../controllers/front/customProductController");
// const upload = require('../middleware/upload');
const upload = require("../middleware/upload")("uploads/services");

router.get("/products", getAllProducts);
router.get("/get-product/:id", getProductById);
router.post(
  "/add-product",
  authenticateAdmin,
  upload.fields([
    { name: "product_img", maxCount: 1 },
    { name: "upload_multiple_img", maxCount: 10 },
    { name: "upload_brouch_english", maxCount: 1 },
    { name: "upload_brouch_hindi", maxCount: 1 },
  ]),
  productValidationRules,
  validateRequest,
  createProudct
);
router.put(
  "/add-product/:id",
  authenticateAdmin,
  upload.fields([
    { name: "product_img", maxCount: 1 },
    { name: "upload_multiple_img", maxCount: 10 },
    { name: "upload_brouch_english", maxCount: 1 },
    { name: "upload_brouch_hindi", maxCount: 1 },
  ]),
  productValidationRules,
  validateRequest,
  updateProduct
);
router.delete("/delete-product/:id", authenticateAdmin, deleteProduct);

router.post("/ajax/product-list", getAjaxproducts);

router.get("/by-categories/:categoryId", getProductsByCategoryID);

router.get("/product-details/:id", getProductDetails);

router.get("/check-unique", uniqueEnProduct);

module.exports = router;
