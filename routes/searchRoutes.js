
const express = require('express');
const { search } = require('../controllers/admin/searchController');
const router = express.Router();

router.get('/search',search );

 

module.exports = router;

