const ActiveConversations = require("../models").active_conversations;
const joinRoom = async (socket, io, payload) => {
const { conversationId ,userId} = payload;
        const conversationRoomName = `room:${conversationId}`;
        socket.join(conversationRoomName);
        const activeConversations = await ActiveConversations.findOne({
            where: {
               conversationId: conversationId,
               userId: userId,
            }
        }
        )
        if (activeConversations) {
          console.log("user is already active on this conversation");
        }
        else {
            await ActiveConversations.create({
                conversationId: conversationId,
                userId:userId,
            })
        }
    }
;

module.exports = joinRoom;
