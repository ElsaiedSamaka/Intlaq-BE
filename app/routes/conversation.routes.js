const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");
const { checkUser } = require("../middleware");
// Get List of conversation
router.get("/",  conversationController.getConversations);
// Create conversation
router.post("/", conversationController.createConversation)
// get conversation
router.get("/:id",conversationController.getConversationById)
// delete conversation
router.delete('/:id',conversationController.deleteConversationById)
module.exports = router;
