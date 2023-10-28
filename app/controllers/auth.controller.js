const User = require("../models").user;
const ProgramingLanguages = require("../models").programming_languages;
const UserProgrammingLanguage =require("../models").user_programming_language;
const createAccessToken = require("../helper/createToken.helper");
const middleware = require( "../middleware/index" );
const Follow = require("../models").follow;
const { uploadFile } = require("../helper/uploadFiles");
const { comparePassword } = require("../helper/bcrypt.helper");
const RefreshToken = require("../models").refresh_token;
const RememberMeToken = require("../models").remember_me;
const config = require("../config/auth.config");

// signup controller
const signup = async (req, res) => {
  // use isRememberMe to check if user want to remember me and create a new remember me token
  // const isRememberMe = req.body.rememberMe;
  
  try {
    const {  firstname, lastname, nationalID, email,phonenumber, birthdate , city,user_img, biography, programingLanguages, experienceLevel, experienceYears,password,passwordConfirmation, userType} = req.body;
    const user = await User.create({
      firstname:firstname,
      lastname:lastname,
      nationalID:nationalID,
      email: email,
      phonenumber:phonenumber,
      birthdate:birthdate,
      city:city,
      biography:biography,
      experienceLevel:experienceLevel,
      experienceYears:experienceYears,
      username: `${firstname} ${lastname}`,
      // a placeholder img is being used and can be updated after
      user_img:
        "https://res.cloudinary.com/dwi0qvtbe/image/upload/v1695691224/users_img/profile_zu3vqf.png",
      password: password,
      passwordConfirmation: passwordConfirmation,
      userType:userType
    });
    programingLanguages.forEach(async (programmingLanguage) => {
      const userProgrammingLanguage = await UserProgrammingLanguage.create({
        userId: user.id,
        programmingLanguageId: programmingLanguage.id,
      });
    })

    const accessToken = await createAccessToken(user.id);
    req.session.accessToken = accessToken
    middleware.userLogin.trackUserLogin(user.id);
    const refreshToken = await RefreshToken.createRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { expiresIn: config.jwtRefreshExpiration, httpOnly: true });
    const newUser = await User.findByPk(user.id, {
      include: [
        {
          model: Follow,
          as: "follower",
          attributes: ['followerId', 'followingId'],
        },
        {
          model: Follow,
          as: "following",
          attributes: ['followerId', 'followingId'],
        },
      ],
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  const isRememberMe = req.body.rememberMe;

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      include: [
        {
          model: Follow,
          as: "follower",
          attributes: ['followerId', 'followingId'],
        },
        {
          model: Follow,
          as: "following",
          attributes: ['followerId', 'followingId'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "User Not found." });
    }

    if (!comparePassword(req.body.password, user.password)) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const accessToken = await createAccessToken(user.id);
    req.session.accessToken = accessToken
    if (isRememberMe) {
      // Create the remember me token
      const rememberMeToken = await RememberMeToken.createRememberMeToken(user);
      // Store the remember me token 
    res.cookie("rememberMeToken", rememberMeToken, { expiresIn: config.jwtRememberMeExpiration, httpOnly: true });
    }
    const refreshToken = await RefreshToken.createRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { expiresIn: config.jwtRefreshExpiration, httpOnly: true });
    middleware.userLogin.trackUserLogin(user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// signedin controller
const signedin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    res.send({
      message: `Welcome  ${user.firstname} !)`,
      authentication: true,
      username: user.username,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// signout controller
const signout = async (req, res) => {
  try {
    // Clear the refresh token from the client-side
     res.clearCookie('refreshToken');
    // Clear the access token from the client-side
     res.clearCookie('accessToken');
    //  Clear the remember me token from the client-side
     res.clearCookie('rememberMeToken');
     // Clear the refresh token from the database
     await RefreshToken.destroy({ where: { token: req.cookies.refreshToken } });
    // Todo: Clear the remember me token from the database


    res.status(200).send({ message: "User signed out successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// update password
const updatePassword = async(req,res)=>{
  const userId = req.userId
  const { password, passwordConfirmation } = req.body;
  try {
    const existing_user = await User.findByPk(userId);
    if (!existing_user) {
      return res.status(401).json({ message: "User Not found." });
    }
    existing_user.password = password ;
    existing_user.passwordConfirmation = passwordConfirmation ;
    await existing_user.save()
    res.status(200).json(existing_user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
// update avatar 
const updateAvatar = async(req,res)=>{
  const userId = req.userId;
  try {
    const existing_user = await User.findByPk(userId);
    if (!existing_user) {
      return res.status(401).json({ message: "User Not found." });
    }
    const file = req.file;

    if (file !== undefined) {
      const result = await uploadFile(file, "users_img");
      existing_user.user_img = result.secure_url;
      existing_user.cloudinary_id = result.public_id;
    }
    await existing_user.save();
    res.status(200).json(existing_user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while updating user.",
    });
  }
}
module.exports = {
  signup,
  signin,
  signout,
  signedin,
  updatePassword,
  updateAvatar
};