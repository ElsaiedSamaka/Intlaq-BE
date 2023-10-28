const express = require("express");
const router = express.Router();
const checkUser = require( "../middleware/checkUser" );
const repliesController = require("../controllers/replies.controller")

// post new reply
router.post('/', repliesController.createReply)
// get reply by id
router.get('/:id',repliesController.getReplyById)
// update reply by id
router.put('/:id',repliesController.updateReplyById)
// delete reply by id 
router.delete('/:id',repliesController.deleteReplyById)
module.exports = router