const express = require("express");

const notificationController = require("../controller/notificationController");

const router = express.Router();

// Route to send SMS notification via email-to-SMS
router.post("/send-sms", notificationController.sendSMSToVolunteer);

module.exports = router;