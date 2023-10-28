const { Op } = require('sequelize');

const Tags = require('../models').tags
// get all tags 
const getAllTags = async (req, res) => {
  const { name } = req.query;
  let condition = name ?  {
    name: {
      [Op.like]: `%${name}%`,
    },
  }:null;
    try {
      const tags = await Tags.findAll({
        where:condition
      });
      if (!tags) {
        return res.status(404).json({ message: "No Tags found. [Tags controller]" });
      }
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({
        message: error.message || "Some error occurred while retrieving Tags.",
      });
    }
  };
// create tag
const createTag = async (req,res)=>{
    try {
        const {name}=req.body;
        const tag = await Tags.create({
            name: name
        })
      res.status(201).json(tag)
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while creating Tags.",
          });
    }
}
module.exports  ={
    getAllTags,
    createTag
}