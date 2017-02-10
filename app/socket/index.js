'use strict';
const h = require('../helper');

module.exports = (io,app)=>{
  let allrooms = app.locals.chatrooms;

  io.of('/roomslist').on('connection',socket=>{
    socket.on('getChatRooms',()=>{
      socket.emit('chatRoomslist',JSON.stringify(allrooms));
    });
    socket.on('createNewRoom',(roomName)=>{
      //check to see if room of similar title exist or not
      if(!h.findRoomByName(allrooms,roomName)){
        //create a new room and broadcast to all
        allrooms.push({
          room:roomName,
          roomID:h.randomHex(),
          users:[]
        })
        //emit an updated list to creator
        socket.emit('chatRoomslist',JSON.stringify(allrooms));
        //emit an updated list to everyone
        socket.broadcast.emit('chatRoomslist',JSON.stringify(allrooms));
      }
    })
  });
}
