'use strict';
const express  = require('express');
const app = express();
const ChatApp = require('./app');

app.set('port',process.env.port||3000);
app.use(express.static('public'))
app.set('view engine','ejs');

app.use('/',ChatApp.router);

app.listen(app.get('port'),()=>{
  console.log('Chatapp is started at : '+app.get('port'));
});
