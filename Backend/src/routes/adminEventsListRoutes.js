const express = require('express');
const router = express.Router();
const adminEventsListController = require('../controller/adminEventsListController'); 

router.get('/events/:showAll', adminEventsListController.getEventLists);
router.get('/upcomingEvents', adminEventsListController.getUpcomingEvents);
// PATCH /api/admin/volunteers/:id
router.patch('/events/:id', adminEventsListController.updateEvent);


router.get('/cancelevent/:taskid', adminEventsListController.cancelEvent);

module.exports = router; // export the router