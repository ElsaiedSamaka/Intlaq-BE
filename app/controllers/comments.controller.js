const Comment = require("../models").comments;
// post a new Comment 
const createComment = async (req,res)=>{
    try {
        const { content,userId, postId , isAnonymous } = req.body;
        const comment = await Comment.create({userId, content, postId ,isAnonymous});
        const user = await comment.getUser()
        const replies = await comment.getReplies()
        res.status(201).json({...comment.dataValues,user,replies});
      } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while createing comment.",
          });
      }
  }
  // Get Comment by ID
const getCommentById = async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id,{include:{all:true}});
      if (!comment) return res.status(404).json({ message: "No Comment found. [Comment controller] " });
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Comment.",
      });
    }
  };

// Update a Comment by ID
const updateCommentById = async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      comment.update({
        content: req.body.content || comment.content,
      });
      res.status(200).json(comment);
      if (!comment)
        return res
          .status(404)
          .json({ message: "No Comment found. [Comment controller]" });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while updateing Comment.",
      });
    }
  };

// Delete a Comment by ID
const deleteCommentById = async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) return res.status(404).json({ message: "No Comment found. [Comment controller]" });
      comment.destroy();
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while deleteing Comment.",
      });
    }
  };
  
  module.exports = {
    createComment,
    deleteCommentById,
    updateCommentById,
    getCommentById
  }