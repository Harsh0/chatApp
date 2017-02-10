'use strict';
const passport = require('passport');
const config = require('../config');

const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const h = require('../helper');

module.exports = ()=>{
  passport.serializeUser((user,done)=>{
    done(null,user.id);
  })
  passport.deserializeUser((id,done)=>{
    h.findById(id)
      .then(user=>done(null,user))
      .catch(error =>console.log('Error fetching user from id : '+error))
  })
  let authProcessor = (accessToken,refreshToken,profile,done)=>{
    //Find a user in the local db using profile.id
    //if the user data found, return the user data using the done()
    //if the user is not found, create one in the local db and return
    h.findOne(profile.id)
      .then(result=>{
        if(result){
          done(null,result);
        }else{
          //create a user and return
          h.createNewUser(profile)
            .then(newChatUser => done(null,newChatUser))
            .catch(error => console.log('Error while creating new User : '+error))
        }
      })
  }
  passport.use(new FacebookStrategy(config.fb,authProcessor));
  passport.use(new TwitterStrategy(config.twitter,authProcessor));
}
