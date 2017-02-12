'use strict';
//const config = require('./config');
//const redis = require('redis').createClient;
//const adapter = require('socket.io-redis');

//Social authentication code
require('./auth')();

//create an io server instance
let ioServer = app =>{
  app.locals.chatrooms =[];
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  //using redis for socket data buffers
  /*io.set('transports',['websocket']);
  let pubClient = redis(config.redis.port,config.redis.host,{
    auth_pass:config.redis.password
  });
  let subClient = redis(config.redis.port,config.redis.host,{
    auth_pass:config.redis.password,
    return_buffers:true
  });
  io.adapter(adapter({
      pubClient,
      subClient
  }));*/
  io.use((socket,next)=>{
    require('./session')(socket.request,{},next);
  });
  require('./socket')(io,app);
  return server;
}

module.exports = {
    router:require('./routes')(),
    session:require('./session'),
    ioServer,
    logger:require('./logger')
}
