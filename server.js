'use strict';
const express  = require('express');
const app = express();
app.set('port',process.env.port||3000);
app.set('view engine','ejs');

app.get('/',(req,res)=>{
  res.render('login',{
    pageTitle:'My Login Page'
  });
});


app.listen(app.get('port'),()=>{
  console.log('Chatapp is started at : '+app.get('port'));
});
