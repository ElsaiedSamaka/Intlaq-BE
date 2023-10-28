const express = require("express");
const router = express.Router();
const tagsController = require('../controllers/tags.controller')
const checkUser = require( "../middleware/checkUser" );

// get all tags
router.get('/',tagsController.getAllTags)
// post new tag
router.post('/',tagsController.createTag)


module.exports = router