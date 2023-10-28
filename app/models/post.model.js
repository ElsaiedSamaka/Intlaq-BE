module.exports = (sequelize, Sequelize) => {
    const Posts = sequelize.define("posts", {
      postType:{
        type:Sequelize.ENUM('Article','Job'),
      },
      img: {
        type: Sequelize.TEXT,
      },
      cloudinary_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title:{
        type: Sequelize.STRING
      },
    content:{
        type:  Sequelize.TEXT
    },
    isAnonymous:{
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    },{
      indexes: [
        {
          type: 'FULLTEXT',
          fields: ['title', 'content'],
        },
      ],
    });
   
  Posts.search = function(query) {
    return sequelize.query(`
    SELECT *, MATCH(title, content) AGAINST (:query IN BOOLEAN MODE) AS relevance
    FROM posts
    WHERE MATCH(title, content) AGAINST (:query IN BOOLEAN MODE)
    ORDER BY relevance DESC
    `, 
    { 
      replacements: { query: query }, 
      type: sequelize.QueryTypes.SELECT 
    });
  };

    return Posts;
  };
  