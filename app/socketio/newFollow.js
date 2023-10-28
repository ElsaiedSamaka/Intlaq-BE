const User = require("../models").user;

//  *  @description  this function is called when a user follows another user
//  *  @param {socket} socket
//  *  @param {io}
const newFollow = async (socket, io, payload) => {
    try {
      const {userId,followedUserId} = payload;
      //  find who is following this user and send them a newNotification
      const user = await User.findByPk(userId);
      const followedUser = await User.findByPk(followedUserId);
      const notification = {
        type: "newFollow",
        to: followedUser,
        from: user,
      }
      socket.to(followedUser.socketId).emit("newNotification", notification);
    } catch (err) {
      console.error('[1;31m' ,"error [newFollow]",err);
    }
   }
;

module.exports = newFollow;
