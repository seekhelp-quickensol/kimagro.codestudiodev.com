const express = require("express");
const router = express.Router();
const { loginUser, fetchSession, logoutUser} = require("../controllers/admin/authController");


router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", fetchSession);




module.exports = router;
