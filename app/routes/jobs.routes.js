const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobs.controller");

router.get("/byUser/:userId", jobsController.getApplicationsByUser)
router.get("/byJob/:jobId", jobsController.getApplicationsByJob)
router.post("/create-application", jobsController.createApplication)
router.put("/update-application/:applicationId", jobsController.updateApplication)
router.delete("/delete-application/:applicationId", jobsController.deleteApplication)
module.exports = router