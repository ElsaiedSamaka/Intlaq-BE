const { Op } = require("sequelize");
const Message = require("../models").message;
const User = require("../models").user;
const Conversation = require("../models").conversation;
const ActiveConversations = require("../models").active_conversations;

const sendMessage = async (socket, io, data) => {
  const { senderId, receiverId, conversationId, message } = data;
  const conversationRoomName = `room:${conversationId}`;
  try {
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: receiverId,
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation.id,
      senderId,
      recipientId: receiverId,
      message,
    });

    const detailedMessage = await Message.findByPk(newMessage.id, {
      include: { all: true },
    });

    // Emit the message to the sender and receiver
    io.to(conversationRoomName).emit("newMessage", detailedMessage);
     // get the receiver's socket ID
    const receiver = await User.findByPk(receiverId);
    // Check if the receiver has joined the conversation room
    const activeConversation = await ActiveConversations.findOne({
      where: {
        conversationId,
        userId: receiverId,
      },
    });

    if (activeConversation) {
      // Receiver has joined the conversation room, send the message directly to their socket
      // io.to(receiver.socketId).emit("newMessage", detailedMessage);
    } else {
      // Receiver has not joined the conversation room, store the message in a database table
      // Send a notification to the receiver that they have a new message
      io.to(receiver.socketId).emit("newMessageNotification", detailedMessage);
    }
   
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = sendMessage;