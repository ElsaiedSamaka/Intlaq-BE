const { Op } = require("sequelize");

const Message = require("../models").message;

const getMessages = async (socket, io, payload) => {
  const { sender, recipient } = payload;
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        {
          senderId: sender,
          recipientId: recipient,
        },
        {
          senderId: recipient,
          recipientId: sender,
        },
      ],
    },
    include: {
      all: true,
    },
  });
  const recipientRoomName = `room:${recipient}-${sender}`;
  const senderRoomName = `room:${sender}-${recipient}`;
  io.to(socket.id).emit("messages", messages);
};

module.exports = getMessages;
