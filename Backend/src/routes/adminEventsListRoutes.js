const express = require('express');
const router = express.Router();
const adminEventsListController = require('../controller/adminEventsListController'); 

router.get('/events/:showAll', adminEventsListController.getEventLists);
router.get('/upcomingEvents', adminEventsListController.getUpcomingEvents);

router.get('/cancelevent/:taskid', adminEventsListController.cancelEvent);

module.exports = router; // export the router