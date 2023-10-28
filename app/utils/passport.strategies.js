const passport = require('passport');
const { comparePassword } = require('../helper/bcrypt.helper');
const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const RememberMe = require('../models').remember_me;
const User = require('../models').user;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
// local strategy
const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    }, async (email,password,done)=>{
        console.log("email",email);
        console.log("password",password);
        const user = await User.findOne({where:{email:email}});
        if(!user){
            return done(null,false,{message:"User not found"})
        }
        if(!comparePassword(password,user.password)){
            return done(null,false,{message:"Incorrect password"})
        }
        done(null,user)
    }
)
const rememberMeStrategy = new RememberMeStrategy({
    key: 'remember_me', 
},
    async (token, done) => {
      const rememberMe = await RememberMe.findOne({
        where: { token },
      });
  
      if (rememberMe) {
        // The token is valid, so return the user object.
        done(null, rememberMe.user);
      } else {
        // The token is invalid, so return null.
        done(null, null);
      }
    },
    async (user, done) => {
      const rememberMeToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtRememberMeExpiration,
      });
  
      const token = await RememberMe.create({
        token: rememberMeToken,
        user_id: user.id,
        expiresAt: config.jwtRememberMeExpiration,
      });
  
      done(null, token);
    },
    async (token, done) => {
      await RememberMe.destroy({
        where: { token },
      });
  
      done(null);
    }
  );
passport.use(localStrategy);
passport.use(rememberMeStrategy);