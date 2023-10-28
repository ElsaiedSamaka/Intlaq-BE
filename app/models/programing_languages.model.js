module.exports = (sequelize, Sequelize) => {
    const ProgramingLanguages  = sequelize.define("programing_languages", {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
         type: Sequelize.STRING,
        },
        
        },{
            timestamps: false,
        });
        return ProgramingLanguages;
}