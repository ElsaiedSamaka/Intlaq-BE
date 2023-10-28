const User = require("../models").user;
const Article = require("../models").posts;
const newComment = async (socket, io, payload) => {
    try {
      const {userId,articleId} = payload;
      console.log('[1;32m' ,"userId",userId , "articleId",articleId);
      
      const user = await User.findByPk(userId);
      const article = await Article.findByPk(articleId,{include:User});
       const notification = {
         type: "newComment",
         article: article,
         from: user,
       }
       socket.to(article.user.socketId).emit("newNotification", notification);
    } catch (err) {
      console.error('[1;31m' ,"error [newComment]",err);
    }
   }
;

module.exports = newComment;
