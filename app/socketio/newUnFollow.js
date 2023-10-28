const User = require("../models").user;

//  *  @description  this function is called when a user follows another user
//  *  @param {socket} socket
//  *  @param {io}
const unFollow = async (socket, io, payload) => {
    try {
      const {userId,unfollowedUserId} = payload;
      //  find who is following this user and send them a newNotification
      const user = await User.findByPk(userId);
      const unFollowedUser = await User.findByPk(unfollowedUserId);
      const notification = {
        type: "unFollow",
        to: unFollowedUser,
        from: user,
      }
      socket.to(unFollowedUser.socketId).emit("newNotification", notification);
    } catch (err) {
      console.error('[1;31m' ,"error [unFollow]",err);
    }
   }
;

module.exports = unFollow;
