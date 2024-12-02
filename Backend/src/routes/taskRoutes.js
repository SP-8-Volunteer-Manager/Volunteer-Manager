const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');



router.get('/taskTypes', taskController.getTaskTypes);
router.get('/shift', taskController.getShift);
router.post('/createTask', taskController.createTask);
router.post('/assignVolunteer', taskController.assignVolunteerToTask );
router.post('/notifyVolunteers', taskController.notifyMatchingVolunteers );
router.get('/:taskId', taskController.getTaskDetails);


module.exports = router;