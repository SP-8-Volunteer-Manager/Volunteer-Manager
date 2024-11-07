const express = require('express');
const router = express.Router();
const adminEventsListController = require('../controller/adminEventsListController'); 

router.get('/events', adminEventsListController.getEventLists);
router.get('/upcomingEvents', adminEventsListController.getUpcomingEvents);

module.exports = router; // export the router