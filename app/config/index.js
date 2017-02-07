'use strict';
if(process.env.NODE_ENV==='production'){
    //offer production stage development environment
    module.exports = {
        host:process.env.host,
        dbURI:process.env.dbURI
    }
}else{
    module.exports = require('./development.json');
}