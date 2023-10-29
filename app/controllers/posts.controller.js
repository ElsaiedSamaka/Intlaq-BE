const { Sequelize } = require("sequelize");
const { getPagination, getPagingData } = require("../helper/getPagination");
const { uploadFile } = require("../helper/uploadFiles");
const Reply = require("../models").replies;
const Tags  = require("../models").tags;
const User = require("../models").user;
const Post = require("../models").posts;
const SavedPosts = require("../models").saved_posts;
const FavPosts = require("../models").loved_posts;
const Comment = require("../models").comments;
const Follow = require("../models").follow;
const Jobs = require("../models").jobs;

// Get List of Posts
const getPosts = async (req, res) => {
  const { title, page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  try {
    const posts = await Post.findAndCountAll({
      where: condition,
      include: [
        {
          model: FavPosts,
          as: "loved_posts",
          attributes: ['userId','postId'],
        },
        {
          model: SavedPosts,
          as: "saved_posts",
          attributes: ['userId','postId'],
        },
        {
          model: Comment,
        },
        {
          model: User,
          include: [
            {
              model: Follow, // Assuming you have a model called Follow for the follow association
              as: "follower",
              attributes: ['followerId', 'followingId'],
            },
            {
              model: Follow, // Assuming you have a model called Follow for the follow association
              as: "following",
              attributes: ['followerId', 'followingId'],
            },
          ],
        },
        {
          model:Tags
        }
      ],
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM loved_posts WHERE loved_posts.postId = posts.id)'), 'loveCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM saved_posts WHERE saved_posts.postId = posts.id)'), 'saveCount']
        ]
      },
      limit,
      offset
    });
    if (!posts) return res.status(404).json({ message: "No Posts found." });
    const response = getPagingData(posts, page, limit, posts.rows.length);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving Posts.",
    });
  }
};
// post a new Post 
const createPost = async (req,res)=>{
  const {postType, title, content, tagsIds, userId, isAnonymous, company,workplace,location,description,type} = req.body;
  const tagsArr = tagsIds ? tagsIds.split(",") : [tagsIds];
    try {
      switch (postType) {
        case "Article":
          if(req.file){
            const file = req.file;
            const result = await uploadFile(file, "posts_cover");
           const newPost = await Post.create({
            postType:postType,
               img: result.secure_url,
               title: title,
               content: content,
               userId: userId,
               isAnonymous: isAnonymous,
               cloudinary_id: result.public_id,
             });
             if (tagsIds && tagsArr.length > 0) {
              await newPost.addTags(tagsArr);
            }
            const addedPost = await Post.findByPk(newPost.id,{
              include: [
                {
                  model: FavPosts,
                  as: "loved_posts",
                  attributes: ['userId','postId'],
                },
                {
                  model: SavedPosts,
                  as: "saved_posts",
                  attributes: ['userId','postId'],
                },
                {
                  model: Comment,
                },
                {
                  model: User,
                  model: User,
                  include: [
                    {
                      model: Follow, // Assuming you have a model called Follow for the follow association
                      as: "follower",
                      attributes: ['followerId', 'followingId'],
                    },
                    {
                      model: Follow, // Assuming you have a model called Follow for the follow association
                      as: "following",
                      attributes: ['followerId', 'followingId'],
                    },
                  ],
                },
                {
                  model:Tags
                }
              ],
              attributes: {
                include: [
                  [Sequelize.literal('(SELECT COUNT(*) FROM loved_posts WHERE loved_posts.postId = posts.id)'), 'loveCount'],
                  [Sequelize.literal('(SELECT COUNT(*) FROM saved_posts WHERE saved_posts.postId = posts.id)'), 'saveCount']
                ]
              },
            })
         res.status(201).json(addedPost);
        }else{
          const newPost = await Post.create({
            postType:postType,
            title: title,
            content: content,
            userId: userId,
            isAnonymous: isAnonymous,
          });
          if (tagsIds && tagsArr.length > 0) {
            await newPost.addTags(tagsArr);
          }
          // const tags = await newPost.getTags();
          // const user = await newPost.getUser();
          // const comments = await newPost.getComments();
          const addedPost = await Post.findByPk(newPost.id,{
            include: [
              {
                model: FavPosts,
                as: "loved_posts",
                attributes: ['userId','postId'],
              },
              {
                model: SavedPosts,
                as: "saved_posts",
                attributes: ['userId','postId'],
              },
              {
                model: Comment,
              },
              {
                model: User,
                model: User,
                include: [
                  {
                    model: Follow, // Assuming you have a model called Follow for the follow association
                    as: "follower",
                    attributes: ['followerId', 'followingId'],
                  },
                  {
                    model: Follow, // Assuming you have a model called Follow for the follow association
                    as: "following",
                    attributes: ['followerId', 'followingId'],
                  },
                ],
              },
              {
                model:Tags
              }
            ],
            attributes: {
              include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM loved_posts WHERE loved_posts.postId = posts.id)'), 'loveCount'],
                [Sequelize.literal('(SELECT COUNT(*) FROM saved_posts WHERE saved_posts.postId = posts.id)'), 'saveCount']
              ]
            },
          })
       res.status(201).json(addedPost);
        }
          break;
      case 'Job':
        const newPost = await Post.create({
          postType:postType,
          title: title,
          content: content,
          userId: userId,
          isAnonymous: isAnonymous,
        });
        if (tagsIds && tagsArr.length > 0) {
          await newPost.addTags(tagsArr);
        }
         const newJob = await Jobs.create({
          postId:newPost.id,
          title:title,
          company:company,
          workplace:workplace,
          location:location,
          description:description,
          type:type
         })
       res.status(201).json(newJob);
        default:
          res.status(200).json({message:"default [PostController]"})
          break;
      }
    } catch (err) {
   res.status(500).json({
       message: err.message || "Some error occurred while creating Post. [Posts controller]",
     }); 
    }
}

// Get Post by ID
const getPostById = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id,{include:{all:true}});
      if (!post) return res.status(404).json({ message: "No Post found. [Posts controller] " });
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Post.",
      });
    }
  };

// Update a Post by ID
const updatePostById = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      post.update({
        firstname: req.body.firstname || post.firstname,
        lastname: req.body.lastname || post.lastname,
        phonenumber: req.body.phonenumber || post.phonenumber,
        email: req.body.email || post.email,
        birthdate: req.body.birthdate||post.birthdate,
        address: req.body.address || post.address,
      });
      res.status(200).json(post);
      if (!post)
        return res
          .status(404)
          .json({ message: "No Post found. [Post controller]" });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while updateing Post.",
      });
    }
  };

// Delete a Post by ID
const deletePostById = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ message: "No Post found. [Post controller]" });
      post.destroy();
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while deleteing Post.",
      });
    }
  };
// save post by id
const savePostById = async (req,res)=>{
  try {
   const userId = req.body.userId;
   const postId = req.params.id;
   const user = await User.findByPk(userId);
   const post = await Post.findByPk(postId);
   if (!user || !post) {
     return res.status(404).json({ error: 'User or post not found' });
   }
  const savedPost = await SavedPosts.create({
    userId,postId
  })
   res.status(200).json(savedPost); 
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while saveing Post.",
    });
  }
} 
// un save post by id
const unSavePostById = async (req, res) => {
  try {
    const userId = req.body.userId;
    const postId = req.params.id;
  const savedPost = await SavedPosts.findOne({
    where:{
      userId: userId,
      postId: postId
    }
  })
  if(!savedPost) return res.status(404).json({message:"No Saved Post found"})
  await savedPost.destroy()
    res.status(200).json(savedPost); 
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while unsaving Post.',
    });
  }
};
//get saved posts of current user
const getSavedPosts = async (req, res) => {
  try {
    const savedPosts = await SavedPosts.findAll({
      where: {
        userId: req.body.userId,
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'img', 'title', 'content', 'isAnonymous'],
          include: [
            {
              model: User,
              attributes: ['id', 'email', 'user_img'],
            },
            {
              model: Comment,
            },
            {
              model: FavPosts,
              as: 'loved_posts',
            },
            {
              model:Tags,
              attributes: ['id', 'name']
            }
          ],
        },
      ],
      // attributes: ['id'], // Include the primary key attribute for the SavedPosts model
      // group: [ 'userId'], // Group by post.id and user.id to aggregate like counts
    });
    if (!savedPosts)
      return res.status(404).json({ message: "No savedPosts found" });
    res.status(200).json(savedPosts);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Some error occurred while retrieving savedPosts",
    });
  }
};
// fav post by id
const favPostById = async (req,res)=>{
  try {
    const userId = req.body.userId;
    const postId = req.params.id;
    const user = await User.findByPk(userId);
    const post = await Post.findByPk(postId);
    if (!user || !post) {
      return res.status(404).json({ error: 'User or post not found' });
    }
   const lovedPost = await FavPosts.create({
     userId,postId
   })
    res.status(200).json(lovedPost); 
   } catch (err) {
     res.status(500).json({
       message: err.message || "Some error occurred while saveing Post.",
     });
   }
}
// unfav post by id 
const unFavPostById = async (req,res)=>{
  try {
    const userId = req.body.userId;
    const postId = req.params.id;
  const lovedPost = await FavPosts.findOne({
    where:{
      userId: userId,
      postId: postId
    }
  })
  if(!lovedPost) return res.status(404).json({message:"No lovedPost found"})
  await lovedPost.destroy()
    res.status(200).json(lovedPost); 
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while unsaving Post.',
    });
  }
}
// get post comments
const getCommentsById = async (req,res)=>{
  try {
    const { id } = req.params;
    const comments = await Comment.findAll({ where: { postId:id } ,include:[{
      model:User,
      include: [
        {
          model: Follow, // Assuming you have a model called Follow for the follow association
          as: "follower",
          attributes: ['followerId', 'followingId'],
        },
        {
          model: Follow, // Assuming you have a model called Follow for the follow association
          as: "following",
          attributes: ['followerId', 'followingId'],
        },
      ],
    },{
      model:Reply,
      include:{
        model: User,
        include: [
          {
            model: Follow, // Assuming you have a model called Follow for the follow association
            as: "follower",
            attributes: ['followerId', 'followingId'],
          },
          {
            model: Follow, // Assuming you have a model called Follow for the follow association
            as: "following",
            attributes: ['followerId', 'followingId'],
          },
        ],
      }
    }]});
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
// get post by following users
const getPostsByFollowing = async(req,res)=>{
  const { title, page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const userId = req.body.userId
  try {
     // Find the users that the specified user is following
  const following = await Follow.findAll({
    
    where: { followerId: userId },
    attributes: ['followingId'], // Retrieve only followingId
  });

  // Extract the followingIds from the results
  const followingIds = following.map((follow) => follow.followingId);
  // Find the posts created by the users in followingIds
  const posts = await Post.findAndCountAll({
    where: { userId: followingIds  ,isAnonymous: false},
    include: [
      {
        model: FavPosts,
        as: "loved_posts",
        attributes: ['userId','postId'],
      },
      {
        model: SavedPosts,
        as: "saved_posts",
        attributes: ['userId','postId'],
      },
      {
        model: Comment,
      },
      {
        model: User,
        include: [
          {
            model: Follow, // Assuming you have a model called Follow for the follow association
            as: "follower",
            attributes: ['followerId', 'followingId'],
          },
          {
            model: Follow, // Assuming you have a model called Follow for the follow association
            as: "following",
            attributes: ['followerId', 'followingId'],
          },
        ],
      },
      {
        model:Tags
      }
    ], attributes: {
      include: [
        [Sequelize.literal('(SELECT COUNT(*) FROM loved_posts WHERE loved_posts.postId = posts.id)'), 'loveCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM saved_posts WHERE saved_posts.postId = posts.id)'), 'saveCount']
      ]
    },
    limit,
    offset
  }) // Include the associated User model
  const response =  getPagingData(posts, page, limit, posts.rows.length);
  res.status(200).json(response)
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while getting Posts of following users.',
    });
  }
}
// get posts by tag id
const getPostsByTagId = async (req, res) => {
  const { tags } = req.body;
  try {
    // Find the posts by the tags
    const posts = await Post.findAll({
      include: [
        {
          model: Tags,
          where: { id: [tags] },
        },
        {
          model: FavPosts,
          as: "loved_posts",
          attributes: ['userId','postId'],
        },
        {
          model: SavedPosts,
          as: "saved_posts",
          attributes: ['userId','postId'],
        },
        {
          model: Comment,
        },
        {
          model: User,
          include: [
            {
              model: Follow, // Assuming you have a model called Follow for the follow association
              as: "follower",
              attributes: ['followerId', 'followingId'],
            },
            {
              model: Follow, // Assuming you have a model called Follow for the follow association
              as: "following",
              attributes: ['followerId', 'followingId'],
            },
          ],
        },
      ],
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM loved_posts WHERE loved_posts.postId = posts.id)'), 'loveCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM saved_posts WHERE saved_posts.postId = posts.id)'), 'saveCount']
        ]
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while getting posts by tag ID.',
    });
  }
};
// get posts by user id
const getPostsByUseId = async (req, res) => {
  const { userId } = req.params;
  try {
    // Find the posts by the user id
    const posts = await Post.findAll({
      where: { userId:userId },
      include: [
        {
          model: Tags,
        },
        {
          model: FavPosts,
          as: "loved_posts",
          attributes: ['userId','postId'],
        },
        {
          model: SavedPosts,
          as: "saved_posts",
          attributes: ['userId','postId'],
        },
        {
          model: Comment,
        },
        {
          model: User,
          include: [
            {
              model: Follow, // Assuming you have a model called Follow for the follow association
              as: "follower",
              attributes: ['followerId', 'followingId'],
            },
            {
              model: Follow, // Assuming you have a model called Follow for the follow association
              as: "following",
              attributes: ['followerId', 'followingId'],
            },
          ],
        },
      ],
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM loved_posts WHERE loved_posts.postId = posts.id)'), 'loveCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM saved_posts WHERE saved_posts.postId = posts.id)'), 'saveCount']
        ]
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while getting posts by tag ID.',
    });
  }
};

// full text search over posts
const searchPosts = async (req, res) => {
  try {
    const { t } = req.query;
    const posts = await Post.search(t);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while getting posts by full text search.',
    });
  }
}
module.exports = {
    getPosts,
    createPost,
    getPostById,
    updatePostById,
    deletePostById,
    savePostById,
    unSavePostById,
    getSavedPosts,
    favPostById,
    unFavPostById,
    getCommentsById,
    getPostsByFollowing,
    getPostsByTagId,
    getPostsByUseId,
    searchPosts
}