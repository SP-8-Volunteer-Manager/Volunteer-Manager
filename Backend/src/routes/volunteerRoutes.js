const express = require('express');
const router = express.Router();
const volunteerController = require('../controller/volunteerController');

router.get('/volunteers/details', volunteerController.getVolunteers);

router.patch('/volunteers/:id', volunteerController.updateVolunteerStatus); 

router.get('/volunteers/new/count', volunteerController.getNewVolunteersCount);

// PATCH /api/admin/volunteers/:id
router.patch('/volunteers/info/:id', volunteerController.updateVolunteer);

router.get('/scheduleOptions', volunteerController.getSchedulePreferences);
router.get('/taskOptions', volunteerController.getTaskOptions);
// my profile related routes
router.post('/getMyProfile', volunteerController.getMyProfile);
router.post('/volunteers/updateMyProfile', volunteerController.updateMyProfile);

router.get('/volunteers/upcomingevent/count/:userid', volunteerController.getUpcomingEventCount);


module.exports = router; // export the router