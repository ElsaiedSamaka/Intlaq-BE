const User = require("../models").user;
const newPost = async (socket, io, payload) => {
     try {
        const {userId,article} = payload;
        // find who is following this user and send them a newNotification 
        const following = await User.findAll({followers:userId});
        following.forEach(user => {
          io.to(user.socketId).emit('newNotification', {
            type: "newPost",
            article,
            userId
          });
        })
      }
      catch (err) {
       console.error('[1;31m' ,"error [newPost]",err);
     }
    }
;

module.exports = newPost;
