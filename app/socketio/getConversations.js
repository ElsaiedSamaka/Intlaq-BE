const { Op } = require("sequelize");
const User = require("../models").user;
const Message = require("../models").message;
const Conversation = require("../models").conversation
const getConversations = async (socket, io, payload) => {
    const {currentUserId} = payload;
    try {
      const conversations = await Conversation.findAll({
        where: {
          [Op.or]: [
            { user1Id: currentUserId },
            { user2Id: currentUserId }
          ]
        },
        include:{all:true}
      });
        io.to(socket.id).emit("emittedConversation", conversations);
      } catch (err) {
        console.log("error while retrieving contacted users",err);
      }
}
module.exports = getConversations;