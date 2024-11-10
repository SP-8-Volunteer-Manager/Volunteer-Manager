const express = require("express");

const confirmationController = require("../controller/confirmationController");

const router = express.Router();



// Route to send notification
router.get("/confirmAvailability", confirmationController.confirmAvailability);
module.exports = router;