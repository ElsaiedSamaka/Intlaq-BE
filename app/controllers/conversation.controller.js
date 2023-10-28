const { Sequelize } = require("sequelize");
const { getPagination, getPagingData } = require("../helper/getPagination");
const { uploadFile } = require("../helper/uploadFiles");
const { tags } = require("../models");
const User = require("../models").user;
const Post = require("../models").posts;
const SavedPosts = require("../models").saved_posts;
const FavPosts = require("../models").loved_posts;
const Comment = require("../models").comments;
const Conversation = require("../models").conversation

// Get List of Conversations
const getConversations = async (req, res) => {
 
};
// post a new Conversation 
const createConversation = async (req,res)=>{

}

// Get Conversation by ID
const getConversationById = async (req, res) => {
    try {
      const conversation = await Conversation.findByPk(req.params.id,{include:{all:true}});
      const messages = await conversation.getMessages({include:{all:true}});
      
      if (!conversation) return res.status(404).json({ message: "No conversation found. [conversation controller] " });
      res.status(200).json({...conversation.dataValues,messages});
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving conversation.",
      });
    }
  };

// Delete a Conversation by ID
const deleteConversationById = async (req, res) => {
    try {
      const conversation = await Conversation.findByPk(req.params.id);
      if (!conversation) return res.status(404).json({ message: "No Conversation found. [Conversation controller]" });
      conversation.destroy();
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while deleteing Conversation.",
      });
    }
  };

module.exports = {
    getConversations,
    createConversation,
    getConversationById,
    deleteConversationById
}