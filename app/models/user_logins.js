module.exports = (sequelize, Sequelize) => {
  const UserLogins = sequelize.define("user_logins", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      foreignKey: {
        model: "users",
        field: "id",
      },
    },
    login_time: {
      type: Sequelize.DATE,
    },
  });
  return UserLogins;
};
