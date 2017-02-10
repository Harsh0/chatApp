'use strict';
const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

let _registerRoutes = (routes,method)=>{
    for(let key in routes){
        if(typeof routes[key]==='object'&&routes[key]!==null&&!(routes[key] instanceof Array)){
            _registerRoutes(routes[key],key);
        }else{
            if(method==='get'){
                router.get(key,routes[key]);
            }else if(method==='post'){
                router.post(key,routes[key]);
            }else{
                router.use(routes[key]);
            }
        }
    }
}
let route = routes =>{
    _registerRoutes(routes);
    return router;
}

//Find a single user based on key
let findOne=profileId=>{
  return db.userModel.findOne({profileId});
}

//create a new user and return that instanceof
let createNewUser = profile =>{
  return new Promise((resolve,reject)=>{
    let newChatUser = new db.userModel({
      profileId:profile.id,
      fullName:profile.displayName,
      profilePic:profile.photos[0].value ||''
    })
    newChatUser.save(error=>{
      if(error){
        reject(error);
      }else{
        resolve(newChatUser);
      }
    })
  })
}

//find by id a user from database
let findById = id =>{
  return new Promise((resolve,reject)=>{
    db.userModel.findById(id,(error,user)=>{
      if(error){
        reject(error);
      }else{
        resolve(user);
      }
    })
  })
}
//middleware to check whether therequest is authenticated or not
let isAuthenticated =(req,res,next)=>{
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect('/');
  }
}

//find a charroom by a given name
let findRoomByName = (allrooms,room)=>{
  let findRoom = allrooms.findIndex((element,index,array)=>{
    if(element.room.toLowerCase()===room.toLowerCase()){
      return true;
    }else{
      return false;
    }
  })
  return findRoom>-1?true:false;
}

//a fundtion that generate random room id
let randomHex = ()=>{
  return crypto.randomBytes(24).toString('hex');
}
// a function to find room by id
let findRoomById= (allrooms,id)=>{
  return allrooms.find((element,index,array)=>{
    return element.roomID === id;
  });
}
module.exports = {
    route,
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById
}
