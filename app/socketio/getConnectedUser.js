const User = require("../models").user;
const getConnectedUser = async (socket, io, payload) => {
    const {userId} = payload;
    try {
      const user= await User.findOne({
        where: {
         id: userId
        }
      });
      // set connected user id in socket object
      socket.userId = user.id;
      // set connected user socketId to socket.id
      user.socketId = socket.id;
      // plz don't forget to save user
      await user.save();
      } catch (err) {
        console.log("error while retrieving contacted user",err);
      }
}
module.exports = getConnectedUser;