const bcrypt = require("bcryptjs");
const { hashPassword } = require("../helper/bcrypt.helper");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      username: {
        // virtual attribute that will not be stored in the database but will be returned in the response
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstname} ${this.lastname}`;
        },
      },
      nationalID: {
        type: DataTypes.BIGINT,
        // unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
          isEmail: true,
        },
      },
      phonenumber:{
        type:DataTypes.INTEGER,
        allowNull:false,
        // unique: true,
      },
      birthdate:{
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      city:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_img: {
        type: DataTypes.TEXT,
      },
      biography : {
        type: DataTypes.STRING,
      },
      experienceLevel: {
        type: DataTypes.ENUM('Junior', 'Mid', 'Senior'),
        allowNull: false,
      },
      experienceYears:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      socketId: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your password",
          },
          notEmpty: {
            msg: "Please provide your password",
          },
        },
      },
      passwordConfirmation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your passwordConfirmation",
          },
          notEmpty: {
            msg: "Please provide your passwordConfirmation",
          },
        },
      },
    },
    {
      freezeTableName: true,
      indexes: [{ fields: ["email"] }],
      validate: {
        // validate over common or related records can be placed right here!
        // passwordMatch() {
        //   if (this.password !== this.passwordConfirmation) {
        //     throw new Error("password and passwordConfirmation must match");
        //   } 
        //   // else {
        //   //   this.password = bcrypt.hashSync(this.password, 10);
        //   //   this.passwordConfirmation = this.password;
        //   // }
        // },
      },
      // defaultScope: {
      //   attributes: {
      //     exclude: ['password','passwordConfirmation']
      //   }
      // },
      // scopes: {
      //   // u can name the scope what ever you 
      //   // u can use it like so await User.scope('withPassword').findOne()
      //   withPassword: {
      //     attributes: {
      //       include: ['password']
      //     }
      //   }
      // },
      hooks: {
        beforeSave: async (user, options) => {
          if (user.changed("password")) {
            // const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password =  hashPassword(user.password);
            user.passwordConfirmation =  hashPassword(user.password)
          }
        },
        beforeUpdate: (record, options) => {
          console.log("runs before record update");
        },
        afterDestroy: async (user, options) => {
         console.log("runs after records deleted");
        },
      },
      instanceMethods: {
        validPassword: async function (password) {
          return await bcrypt.compare(password, this.password);
        },
      },
    }
  );
  return User;
};
