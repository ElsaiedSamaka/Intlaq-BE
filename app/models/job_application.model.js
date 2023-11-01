module.exports = (sequelize, Sequelize) => {
    const Application = sequelize.define("job_applications", {
        status:{
            type: Sequelize.ENUM('Pending', 'Accepted','Rejected')
        }
        });
        return Application;
}