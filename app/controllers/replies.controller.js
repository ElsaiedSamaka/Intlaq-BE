const Reply = require("../models").replies;
// post a new Reply 
const createReply = async (req,res)=>{
    try {
        const userId = req.userId
        const { content,  commentId , isAnonymous } = req.body;
        const reply = await Reply.create({userId, content, commentId ,isAnonymous});
        const user = await reply.getUser()
        const comment = await reply.getComment()
        res.status(201).json({...reply.dataValues,user,comment});
      } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while createing comment.",
          });
      }
  }
  // Get Reply by ID
const getReplyById = async (req, res) => {
    try {
      const reply = await Reply.findByPk(req.params.id,{include:{all:true}});
      if (!reply) return res.status(404).json({ message: "No Reply found. [Reply controller] " });
      res.status(200).json(reply);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Reply.",
      });
    }
  };

// Update a Reply by ID
const updateReplyById = async (req, res) => {
    try {
      const reply = await Reply.findByPk(req.params.id);
      reply.update({
        content: req.body.content || reply.content,
      });
      res.status(200).json(reply);
      if (!reply)
        return res
          .status(404)
          .json({ message: "No Reply found. [Reply controller]" });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while updateing Reply.",
      });
    }
  };

// Delete a Reply by ID
const deleteReplyById = async (req, res) => {
    try {
      const reply = await Reply.findByPk(req.params.id);
      if (!reply) return res.status(404).json({ message: "No Reply found. [Reply controller]" });
      reply.destroy();
      res.status(200).json(reply);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while deleteing Reply.",
      });
    }
  };
  
  module.exports = {
    createReply,
    deleteReplyById,
    updateReplyById,
    getReplyById
  }