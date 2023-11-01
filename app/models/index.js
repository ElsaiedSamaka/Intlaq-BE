const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// ==========================
db.user = require( "./user.model.js" )( sequelize, Sequelize );
db.user_logins = require("./user_logins.js")(sequelize, Sequelize);
db.posts = require("./post.model.js")(sequelize,Sequelize)
db.comments = require("./comment.model.js")(sequelize,Sequelize)
db.tags = require('./tags.model.js')(sequelize,Sequelize)
db.post_tags = require('./post_tags.model.js')(sequelize,Sequelize)
db.replies = require('./reply.model.js')(sequelize,Sequelize)
db.loved_posts = require('./loved_posts.model.js')(sequelize,Sequelize)
db.saved_posts = require('./saved_posts.model.js')(sequelize,Sequelize)
db.conversation = require("./conversation.model.js")(sequelize,Sequelize)
db.message = require("./message.model.js")(sequelize,Sequelize);
db.follow = require("./follow.model.js")(sequelize,Sequelize);
db.active_conversations = require("./active_converstions.model.js")(sequelize,Sequelize);
db.refresh_token = require("../models/refresh_token.model.js")(sequelize, Sequelize);
db.remember_me = require("../models/remember_me.model.js")(sequelize, Sequelize);
db.programming_languages = require("./programing_languages.model.js")(sequelize, Sequelize);
db.user_programming_language=require("./user_programminglanguages.model.js")(sequelize, Sequelize);
db.jobs = require("./job.model.js")(sequelize,Sequelize);
db.job_applications = require('./job_application.model')(sequelize,Sequelize);
// ==========================
// relationships db.user <=> db.post
db.user.hasMany(db.posts);
db.posts.belongsTo(db.user)
// relationships db.user <=> db.loved_posts
db.user.belongsToMany(db.posts,{through:'loved_posts'})
db.posts.belongsToMany(db.user,{through:'loved_posts'})
// relationships db.user <=> db.saved_posts
db.user.belongsToMany(db.posts,{through:'saved_posts'})
db.posts.belongsToMany(db.user,{through:'saved_posts'})
// relationships db.post <=> db.loved_posts
db.posts.hasMany(db.loved_posts, { foreignKey: 'postId', as: 'loved_posts' });
db.loved_posts.belongsTo(db.posts,{ foreignKey: 'postId' })
// relationships db.post <=> db.saved_posts
db.posts.hasMany(db.saved_posts,{foreignKey:'postId',as:'saved_posts'})
db.saved_posts.belongsTo(db.posts,{foreignKey:'postId'})
// relationships db.comment <=> db.post
db.posts.hasMany(db.comments);
db.comments.belongsTo(db.posts);
// relationships db.tags <=> db.post
db.posts.belongsToMany(db.tags, { through: 'post_tags' });
db.tags.belongsToMany(db.posts, { through: 'post_tags' });
// relationships db.user <=> db.comment db.user <=> db.replies
db.user.hasMany(db.comments);
db.comments.belongsTo(db.user)
db.user.hasMany(db.replies)
db.replies.belongsTo(db.user)
// relationships db.reply <=> db.comment
db.comments.hasMany(db.replies);
db.replies.belongsTo(db.comments);
// relationships db.user <=> db.conversation
db.conversation.belongsTo(db.user, { as: 'user1' });
db.conversation.belongsTo(db.user, { as: 'user2' });
db.conversation.hasMany(db.message);
db.message.belongsTo(db.conversation);
// relationships db.user <=> db.message
db.message.belongsTo(db.user, { as: "sender" });
db.message.belongsTo(db.user, { as: "recipient" });
// relationship db.user <=> db.follow
db.user.hasMany(db.follow, { foreignKey: 'followerId', as: 'follower' });
db.user.hasMany(db.follow, { foreignKey: 'followingId', as: 'following' });
// relationship db.active_conversations <=> db.user
db.user.hasMany(db.active_conversations, { foreignKey: 'userId' });
db.active_conversations.belongsTo(db.user);
// relationship db.active_conversations <=> db.conversation
db.conversation.hasMany(db.active_conversations,{foreignKey:'conversationId'});
db.active_conversations.belongsTo(db.conversation);
db.refresh_token.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refresh_token, {
  foreignKey: 'userId', targetKey: 'id'
});
// relationship db.programming_languages <=> db.user
db.user.belongsToMany(db.programming_languages, {
  through: db.user_programming_language,
  foreignKey: 'userId',
});
db.programming_languages.belongsToMany(db.user ,{
  through: db.user_programming_language,
  foreignKey: 'programmingLanguageId',
});
// relationship db.posts <=> db.jobs
db.posts.hasOne(db.jobs,{
  onDelete: 'CASCADE'
})
// relationship db.user <=> db.job_applications
db.user.hasMany(db.job_applications);
db.job_applications.belongsTo(db.user);
db.job_applications.belongsTo(db.jobs);
module.exports = db;
