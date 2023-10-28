const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../helper/getPagination");
const { uploadFile } = require("../helper/uploadFiles");
const User = require("../models").user;
const Follow = require("../models").follow;

// Get List of Users
const getUsers = async (req, res) => {
    const { email , page, size} = req.query;
    const { limit, offset } = getPagination(page, size);
    let condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
    try {
      const users = await User.findAndCountAll({
        where: condition,
        limit, offset
      });
      if (!users) return res.status(404).json({ message: "No users found. [users controller]" });
      const response = getPagingData(users, page, limit);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving users.",
      });
    }
  };
// post a new user 
const createUser = async (req,res)=>{
    try {
     const user = await User.create({
         firstname: req.body.firstname,
         lastname: req.body.lastname,
         phonenumber: req.body.phonenumber,
         email: req.body.email,
         birthdate: req.body.birthdate,
         address: req.body.address,
       });
    res.status(201).json(user);
    } catch (err) {
   res.status(500).json({
       message: err.message || "Some error occurred while creating user. [users controller]",
     }); 
    }
}

// Get User by ID
const getUserById = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: "No user found. [users controller] " });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving user.",
      });
    }
  };

// Update a User by ID
const updateUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ message: "No user found." });

    const file = req.file;

    if (file !== undefined) {
      const result = await uploadFile(file, "users_img");
      user.user_img = result.secure_url;
      user.cloudinary_id = result.public_id;
    }

    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.phonenumber = req.body.phonenumber || user.phonenumber;
    user.email = req.body.email || user.email;
    user.birthdate = req.body.birthdate || user.birthdate;
    user.address = req.body.address || user.address;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while updating user.",
    });
  }
};

// Delete a User by ID
const deleteUserById = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: "No user found. [user controller]" });
      user.destroy();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while deleteing user.",
      });
    }
  };
// Follow a user 
const followUser = async(req,res)=>{
  const {followerId,followingId}=req.body;
  try {
   const [user, created] =  await Follow.findOrCreate({
    where: {followerId, followingId} });
   res.status(201).json(user)
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while following user.",
    });
  }
}
// unFollow a user 
const unFollowUser = async(req,res)=>{
  const {followerId,followingId}=req.body;
  try {
   const unFollowedUser =   await Follow.destroy({ where: { followerId, followingId } });
   res.status(200).json(unFollowedUser)
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while unfollowing user.",
    });
  }
}
// fetch the list of users that a particular user is following or the list of users who are following a current user
const getFollowing = async (req,res)=>{
  const userId = req.userId
  try {
    const user = await User.findByPk(userId, { include: [{ model: User, as: 'following' }] });
    if (!user) return res.status(404).json({ message: "No following users found. [user controller]" });
    res.status(200).json(user.following)
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while getting following users.",
    });
  }
}
const getFollowers = async (req,res)=>{
  const userId = req.userId
 try {
  const user = await User.findByPk(userId, { include: [{ model: User, as: 'follower' }] });
  if (!user) return res.status(404).json({ message: "No followers users found. [user controller]" });
  res.status(200).json(user.follower)
 } catch (err) {
  res.status(500).json({
    message: err.message || "Some error occurred while getting followers users.",
  });
 }
}
module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    followUser,
    unFollowUser,
    getFollowing,
    getFollowers
}