const express = require("express");

const notificationController = require("../controller/notificationController");

const router = express.Router();



// Route to send notification
router.post("/send", notificationController.sendNotification);
// Route to opt out from notification
router.post("/optOut", notificationController.optOut);
module.exports = router;