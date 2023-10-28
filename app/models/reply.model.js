module.exports = (sequelize, Sequelize) => {
    const Reply  = sequelize.define("replies", {
        content:{
            type:  Sequelize.STRING
        },
        isAnonymous:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
          }
        });
        return Reply;
}