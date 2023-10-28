module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
        content:{
            type:  Sequelize.TEXT
        },
        isAnonymous:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
        });
        return Comments;
}