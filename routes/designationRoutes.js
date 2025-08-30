const express = require("express");
const router = express.Router();

const { addDesignation,getAllDesignation,getDesignationById,updateDesignation, getAjaxDesignation} = require("../controllers/admin/designationController");
const {
  designationValidationRules,
  validateRequest,
} = require("../validations/validations");
const authenticateAdmin = require("../middleware/authenticateAdmin");



router.get("/designation-list", getAllDesignation);
router.post("/add-designation",authenticateAdmin,  designationValidationRules, validateRequest, addDesignation);
router.put("/add-designation/:id",authenticateAdmin,  designationValidationRules, validateRequest, updateDesignation);
router.get("/get-designation/:id", getDesignationById);

router.post("/ajax/designation-list", getAjaxDesignation);

module.exports = router;
