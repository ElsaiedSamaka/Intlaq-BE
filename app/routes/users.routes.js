const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const checkUser = require( "../middleware/checkUser" );
const upload = require("../utils/multer.config");

// get all users
router.get('/',usersController.getUsers)
// post new user
router.post('/',usersController.createUser)
// follow user
router.post('/follow',usersController.followUser)
// unfollow user
router.post('/unfollow',usersController.unFollowUser)
// get following users
router.get('/following',usersController.getFollowing)
// get followers users
router.get('/followers',usersController.getFollowers)
// get user by id
router.get('/:id',usersController.getUserById)
// update user by id
router.put('/:id',upload.single("file_img"),usersController.updateUserById)
// delete user by id 
router.delete('/:id',usersController.deleteUserById)
module.exports = router