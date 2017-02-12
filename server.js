'use strict';
const express  = require('express');
const app = express();
const ChatApp = require('./app');
const passport = require('passport');

app.set('port',process.env.port||3000);
app.use(express.static('public'))
app.set('view engine','ejs');

app.use(ChatApp.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('morgan')('combined',{
  stream:{
    write:message=>{
      //write to logs
      ChatApp.logger.log('info',message);
    }
  }
}));

app.use('/',ChatApp.router);

ChatApp.ioServer(app).listen(app.get('port'),()=>{
  console.log('Chatapp is started at : '+app.get('port'));
});
