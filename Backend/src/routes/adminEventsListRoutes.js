const express = require('express');
const router = express.Router();
const adminEventsListController = require('../controller/adminEventsListController'); 

router.get('/events', adminEventsListController.getEventLists);

module.exports = router; // export the router