const Jobs = require("../models").jobs;
const User = require("../models").user;
const Application = require("../models").job_applications;

// Get List of Jobs Applications for specific user
const getApplicationsByUser = async(req,res)=>{
    const {userId} = req.params;
    try {
        const applications = await Application.findAll({
            where: {userId}
        });
        return res.status(200).send(applications);
    } catch (error) {
        return res.status(500).send(error);
    }
}
// Get List of Jobs Applications for specific job
const getApplicationsByJob = async(req,res)=>{
    const {jobId} = req.params;
    try {
        const applications = await Application.findAll({
            where: {jobId}
        });
        return res.status(200).send(applications);
    } catch (error) {
        return res.status(500).send(error);
    }
}
// Create new application for specific job
const createApplication = async(req,res)=>{
    const {userId,jobId} = req.body;
    try {
        const application = await Application.create({
            userId,jobId
        });
        return res.status(200).send(application);
    } catch (error) {
        return res.status(500).send(error);
    }
}
// Update application status
const updateApplication = async(req,res)=>{
    const {applicationId,status} = req.body;
    try {
        const application = await Application.findByPk(applicationId);
        application.update({
            status
        });
        return res.status(200).send(application);
    } catch (error) {
        return res.status(500).send(error);
    }
}
// Delete application
const deleteApplication = async(req,res)=>{
    const {applicationId} = req.params;
    try {
        const application = await Application.findByPk(applicationId);
        application.destroy();
        return res.status(200).send(application);
    } catch (error) {
        return res.status(500).send(error);
    }
}
module.exports = {
    getApplicationsByUser,
    getApplicationsByJob,
    createApplication,
    updateApplication,
    deleteApplication
}