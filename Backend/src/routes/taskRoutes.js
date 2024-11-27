const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');



// Route to create a new task
//router.post('/create', taskController.createTask);


// Route to confirm volunteer availability
//router.get('/confirmAvailability', taskController.confirmAvailability);

// Route to assign a volunteer to a task
//router.post('/assignVolunteer', taskController.assignVolunteer);

router.get('/taskTypes', taskController.getTaskTypes);
router.get('/shift', taskController.getShift);
router.post('/createTask', taskController.createTask);
router.post('/assignVolunteer', taskController.assignVolunteerToTask );
router.post('/notifyVolunteers', taskController.notifyMatchingVolunteers );
router.get('/:taskId', taskController.getTaskDetails);


module.exports = router;