module.exports = ( sequelize, DataTypes ) => {
    const ActiveConversations = sequelize.define("active_conversations", {
     id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
       },
    });
    return ActiveConversations
 }