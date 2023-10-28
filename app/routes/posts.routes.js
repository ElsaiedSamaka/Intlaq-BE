const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const upload = require("../utils/multer.config");
const checkUser = require( "../middleware/checkUser" );

// get all posts
router.get('/',postsController.getPosts)
// post new post
router.post('/',upload.single("file_img"),postsController.createPost)
// get Posts By Following
router.post('/following',postsController.getPostsByFollowing)
// full text search 
router.get('/search',postsController.searchPosts)
// get post by id
router.get('/:id',postsController.getPostById)
// update post by id
router.put('/:id',[checkUser.isLoggedIn],postsController.updatePostById)
// delete post by id 
router.delete('/:id',[checkUser.isLoggedIn],postsController.deletePostById)
// save post by id 
router.post('/:id/save',postsController.savePostById)
// unsave post by id 
router.delete('/:id/unsave',postsController.unSavePostById)
//get saved posts of current user
router.get("/user/saved-posts",postsController.getSavedPosts)
// fav post by id
router.post('/:id/fav',postsController.favPostById)
// unfav post by id 
router.post('/:id/unfav',postsController.unFavPostById)
// get post comments
router.get('/:id/comments',postsController.getCommentsById)
// get posts by tag id
router.post('/by-tag',postsController.getPostsByTagId)
// get posts by user id
router.get('/by-user/:userId',postsController.getPostsByUseId)
module.exports = router