const express = require("express");

const confirmationController = require("../controller/confirmationController");

const router = express.Router();



// Route to send notification
router.get("/confirmAvailability", confirmationController.confirmAvailability);
router.get("/availableVolunteers/:taskId", confirmationController.getAvailableVolunteers);
module.exports = router;