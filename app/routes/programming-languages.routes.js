const express = require("express");
const router = express.Router();
const ProgramingLanguages = require("../models").programming_languages;
const {Op}  = require('sequelize')
// get programing languages by name 
router.get("/byName", async (req, res) => {
    const name = req.query.name;
    const programing_languages= await ProgramingLanguages.findAll({where:{name:{
        [Op.like]: `%${name}%`
      }}})
        if (!programing_languages) {
            res.status(404).json({
                message: "No programming languages found",
            })
        }
    res.status(200).json(programing_languages);
})
// get all programming languages
router.get("/", async (req, res) => {
    const programing_languages= await ProgramingLanguages.findAll()
        if (!programing_languages) {
            res.status(404).json({
                message: "No programming languages found",
            })
        }
    res.status(200).json(programing_languages);
})
// create a new programming language
router.post("/", async (req, res) => {
    const programing_language = await ProgramingLanguages.create(req.body);
    res.status(201).json(programing_language);
})
module.exports = router;