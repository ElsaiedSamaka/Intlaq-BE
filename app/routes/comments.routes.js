const express = require("express");
const router = express.Router();
const checkUser = require( "../middleware/checkUser" );
const commentsController = require("../controllers/comments.controller")

// post new comment
router.post('/', commentsController.createComment)
// get comment by id
router.get('/:id',commentsController.getCommentById)
// update comment by id
router.put('/:id',commentsController.updateCommentById)
// delete comment by id 
router.delete('/:id',commentsController.deleteCommentById)
module.exports = router