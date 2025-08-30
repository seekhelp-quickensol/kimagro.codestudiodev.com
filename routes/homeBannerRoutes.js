const express = require('express');
const router = express.Router();

const {createBanner, getBannerById,updateBanner,getAllbanners,getAjaxBanners } = require('../controllers/admin/homeBannerController');
const { bannerValidationRules, validateRequest } = require('../validations/validations');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const upload = require('../middleware/upload')('uploads/videos');

router.get('/banners', getAllbanners);
router.get('/get-banner/:id', getBannerById);
router.post('/home-banner',authenticateAdmin, upload.single("upload_video"),bannerValidationRules, validateRequest, createBanner);
router.put('/home-banner/:id',authenticateAdmin, upload.single("upload_video"),bannerValidationRules, validateRequest, updateBanner);
router.post("/ajax/banner-list", getAjaxBanners);

module.exports = router;  