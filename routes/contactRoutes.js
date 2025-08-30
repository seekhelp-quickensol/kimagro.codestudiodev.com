const express = require("express");
const { createContact, getAjaxContact } = require("../controllers/admin/contactController");
const { validateRequest, contactValiationRules } = require("../validations/validations");

const router = express.Router();
const upload = require("../middleware/upload")("uploads/contact");

router.post("/submit",upload.none(), contactValiationRules, validateRequest, createContact);
router.post('/ajax/contact-list',getAjaxContact);

module.exports = router;