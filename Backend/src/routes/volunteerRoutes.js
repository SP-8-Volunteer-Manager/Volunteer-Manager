const express = require('express');
const router = express.Router();
const volunteerController = require('../controller/volunteerController');

router.get('/volunteers/details', volunteerController.getVolunteers);

router.patch('/volunteers/:id', volunteerController.updateVolunteerStatus); 

router.get('/volunteers/new/count', volunteerController.getNewVolunteersCount);

module.exports = router; // export the router