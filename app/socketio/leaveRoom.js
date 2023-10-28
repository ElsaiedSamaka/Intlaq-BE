const ActiveConversations = require("../models").active_conversations;

const leaveRoom = async (socket, io, payload) => {
    const { conversationId ,userId} = payload;
    console.log("payload", payload);
    const conversationRoomName = `room:${conversationId}`;
    socket.leave(conversationRoomName);
    const activeConversations = await ActiveConversations.findOne({
        where: {
           conversationId: conversationId,
           userId: userId,
        }
    }
    )
    if (activeConversations) {
     await activeConversations.destroy();
    }
    else {
       console.log("user is already not active on this conversation");
    }
};

module.exports = leaveRoom;
