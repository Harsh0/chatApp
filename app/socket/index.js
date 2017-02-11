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

  io.of('/chatter').on('connection',socket=>{
      //join a chatroom
      socket.on('join',(data)=>{
          let usersList =  h.addUserToRoom(allrooms,data,socket);
          //console.log(usersList.users);
          socket.broadcast.to(data.roomID).emit('updateUsersList',JSON.stringify(usersList.users));
          socket.emit('updateUsersList',JSON.stringify(usersList.users));
      });
      socket.on('disconnect',()=>{
        //find the room to which the socket is connected  to and purge the user
        let room = h.removeUserFromRoom(allrooms,socket);
        if(room===undefined) room ={};
        socket.broadcast.to(room.roomID).emit('updateUsersList',JSON.stringify(room.users));
      })
      //when new message arrived
      socket.on('newMessage',data=>{
        socket.broadcast.to(data.roomID).emit('inMessage',JSON.stringify(data));
      })
  });

}
