const Joi = require('joi');

const createUserSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  nationalID: Joi.string().required(),
  email: Joi.string().email().required().domain({allow:["com","net"]}),
  birthdate: Joi.date().max('now').min('1-1-1974').required(),
  city: Joi.string().required(),
  biography: Joi.string().required(),
  programmingLanguages: Joi.string().valid('Java','Python','C#','C++','Javascript','Php','Ruby','Go','Dart').required(),
  experienceLevel: Joi.string().valid('Junior', 'Mid', 'Senior').required(),
  password: Joi.string().required(),
  passwordConfirmation: Joi.ref('password'),
});

const updateUserSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  nationalID: Joi.string(),
  email: Joi.string().email().domain({allow:["com","net"]}),
  birthdate: Joi.date().max('now').min('1-1-1974'),
  city: Joi.string(),
  biography: Joi.string(),
  programmingLanguages: Joi.string().valid('Java','Python','C#','C++','Javascript','Php','Ruby','Go','Dart'),
  experienceLevel: Joi.string().valid('Junior', 'Mid', 'Senior'),
  password: Joi.string(),
  passwordConfirmation: Joi.ref('password'),
})
module.exports = {
  createUserSchema,
  updateUserSchema
};