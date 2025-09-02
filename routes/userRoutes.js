const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUser,
  getUserById,
  updateUser,
  getAjaxUser,
  uniqueEmail,
} = require("../controllers/admin/userController");
const {
  userValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");

router.get("/user-list", getAllUser);
router.post(
  "/add-user",
  authenticateAdmin,
  userValidationRules,
  validateRequest,
  addUser
);
router.put(
  "/add-user/:id",
  authenticateAdmin,
  userValidationRules,
  validateRequest,
  updateUser
);
router.get("/get-user/:id", getUserById);

router.post("/ajax/user-list", getAjaxUser);

 router.get("/check-unique",uniqueEmail);

module.exports = router;
