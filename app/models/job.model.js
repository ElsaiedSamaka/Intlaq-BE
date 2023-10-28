module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define("job", {
      // Additional fields specific to jobs
      company:{
        type: Sequelize.STRING
      },
      workplace:{
        type: Sequelize.ENUM('Office','Hyprid', 'Remote')
      },
      type:{
        type: Sequelize.ENUM('Full-time', 'Part-time')
      },
      location:{
        type: Sequelize.STRING
      },
      salary:{
        type: Sequelize.STRING
      },
      description:{
        type: Sequelize.TEXT
      }
    });
  
    // Define any associations or methods specific to jobs
  
    // Establishing the inheritance relationship
    Job.belongsTo(sequelize.models.posts, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  
    return Job;
  };