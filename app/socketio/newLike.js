const User = require("../models").user;
const Article = require("../models").posts;


const newLike = async (socket, io, payload) => {
    try {
      const {userId,articleId} = payload;
        // find who is following this user and send them a newNotification
      const article = await Article.findByPk(articleId,{include:User});
      const user = await User.findByPk(userId);
        const notification = {
          type: "like",
          from: user,
        };
        socket.to(article.user.socketId).emit("newNotification", notification);
    }
     catch (err) {
      console.error('[1;31m' ,"error [newLike]",err);
    }
   }
;

module.exports = newLike;
