'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);
//log for successfull mongo connection
Mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB successfully');
})
//Log an error if connection fails
Mongoose.connection.on('error',error=>{
   console.log('MongoDB error : ',error); 
});

module.exports = {
    Mongoose
}