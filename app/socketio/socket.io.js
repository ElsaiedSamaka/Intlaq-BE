const socketio = require("socket.io");
const getMessages = require( "./getMessages" );
const sendMessage = require("./sendMessage");
const getConversations = require("./getConversations");
const getConnectedUser = require("./getConnectedUser");
const joinRoom = require("./joinRoom");
const leaveRoom = require("./leaveRoom");
const newPost = require("./newPost");
const newLike = require("./newLike");
const unFollow = require("./newUnFollow");
const newFollow = require("./newFollow");
const newComment = require("./newComment");
function setupSocket(server) {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log(`Socket.IO client ${socket.id} connected`);
    // get connected user
    socket.on("currentUser", (payload) => {
     getConnectedUser(socket, io,payload).catch((error) => {
      console.error(`Error getting connected user: ${error}`);
    });
    })
    // get messages
    socket.on("getMessages", (payload) => {
      getMessages(socket, io, payload).catch((error) => {
        console.error(`Error getting messages: ${error}`);
      });
    });
    // send message
    socket.on("sendMessage", (data) => {
      sendMessage(socket, io, data).catch((error) => {
        console.error(`Error sending message: ${error}`);
      });
    });
    // get conversations
    socket.on("getConversations",(payload)=>{
      getConversations(socket, io, payload).catch((error) => {
        console.error(`Error getting contacts: ${error}`);
      });
    })
      // 2 users connection room 
      socket.on('join', (payload) => {
        joinRoom(socket, io, payload).catch((error) => {
          console.error(`Error joining room: ${error}`);
        })
      });
      socket.on('leave', (payload) => {
        leaveRoom(socket, io, payload).catch((error) => {
          console.error(`Error leaving room: ${error}`);
        })
      });
      // new Post of a following user
      socket.on('newPost',(payload)=>{
        newPost(socket, io, payload).catch((error) => {
          console.error(`Error newPost: ${error}`);
        })
      })
    //  new Like of current user posts
    socket.on('newLike',(payload)=>{
     newLike(socket, io, payload).catch((error) => {
       console.error(`Error newLike: ${error}`);
     })
    })
    // new Comment of current user posts
    socket.on('newComment',(payload)=>{
     newComment(socket, io, payload).catch((error) => {
       console.error(`Error newComment: ${error}`);
     })
    })
    // new Follow of current user
    socket.on('newFollow',(payload)=>{
      newFollow(socket, io, payload).catch((error) => {
       console.error(`Error newFollow: ${error}`);
     })
    })
    // new unFollow of current user
    // socket.on('unFollow',(payload)=>{
    //   unFollow(socket, io, payload).catch((error) => {
    //    console.error(`Error unFollow: ${error}`);
    //  })
    // })
    // handle disconnecting
    socket.on("disconnect", () => {
      console.log(`Socket.IO client ${socket.id} disconnected`);
    });
  });
}

module.exports = setupSocket;
