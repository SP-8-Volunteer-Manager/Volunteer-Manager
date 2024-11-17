
import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../config';


const NewEvent = ({ show, handleClose }) => {
    const [taskTypes, setTaskTypes] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [taskType, setTaskType] = useState('0');
    const [taskShift, setTaskShift] = useState('0');
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [location, setLocation] = useState('');
    const [usermsg, setUserMsg] = useState('');
    const [errors, setErrors] = useState({});
    const [taskFreq, setTaskFreq] = useState(null);
    const [volunteers, setVolunteers] = useState([]);
    const [taskCreated, setTaskCreated] = useState(false);
    const [taskId, setTaskId] = useState(-1);
    const [assignedVolunteer, setAssignedVolunteer] = useState('');
    const [isVolunteerAssigned, setIsVolunteerAssigned] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false);

    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
               
                const response = await fetch(`${API_BASE_URL}/api/task/taskTypes`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                
                const data = await response.json();
                setTaskTypes(data);
            } catch (error) {
                console.error("Error fetching task types:", error);
            }
        };
        const fetchShifts = async () => {
            try {
               
                const response = await fetch(`${API_BASE_URL}/api/task/shift`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }            
                const data = await response.json();
                setShifts(data);
            } catch (error) {
                console.error("Error fetching task types:", error);
            }
        };

        const fetchVolunteers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/details`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setVolunteers(data);
            } catch (error) {
                console.error("Error fetching volunteers:", error);
            }
        };

        if (show) {
            fetchTaskTypes();
            fetchShifts();
            fetchVolunteers();
        }
    }, [show]);


    const handleModalClose = () => {
        setErrors({});
        setEventName('');
        setDescription('');
        setTaskType('0');
        setTaskShift('0');
        setStartDate(null);
        setStartTime(null);
        setLocation('')
        setUserMsg('');
        setTaskFreq(null);
        setTaskCreated(false);
        setNotificationSent(false);
        setAssignedVolunteer('');
        setIsVolunteerAssigned(false);
        handleClose(taskId); //Passing taskid back to parent to check if event was craeted
        setTaskId(-1);
        
    };

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'eventName':
                setEventName(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'location':
                setLocation(value);
                break;
            case 'taskType':
                setTaskType(value);
                break;
            case 'taskShift':
                setTaskShift(value);
                break;
            case 'taskFreq':
                setTaskFreq(e.target.value === 'true');
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };



    const handleSave = async (e) => {
        e.preventDefault();
        setErrors({});
   
        const validationErrors = {};
        if (taskType === '0') validationErrors.taskType = 'Please select a task type.';
        if (!eventName) validationErrors.eventName = 'Event name is required.';
        if (!description) validationErrors.description = 'Description is required.';
        if (!location) validationErrors.location = 'Location is required.';
        if (taskShift === '0') validationErrors.taskShift = 'Please select a task shift.';
        if (taskFreq === null) validationErrors.taskFreq = 'Please select a task frequency.';
       
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        
        try{
            
     
            const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
            const formattedStartTime = startTime ? startTime.toLocaleTimeString('en-US', { hour12: false }) : null;

            const postData = {
                name: eventName,
                description,
                task_type_id: taskType,  
                is_recurring: taskFreq, 
                shift_id: taskShift,  
                start_date: formattedStartDate,  
                start_time: formattedStartTime,  
                location, 
              };
            const response = await fetch(`${API_BASE_URL}/api/task/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            const result = await response.json();
            

            if (response.ok) {
                console.log("Response received:", result); 
               
                if (result.task) {
                    
                    setTaskCreated(true);

                    setTaskId(result.task[0].id);
                    setUserMsg(result.message || 'Event saved successfully!');
                }
            } else{
                setUserMsg(result.message || 'Failed to save event.');
            }
            
        }
         catch(error){
            console.log("Error saving event:")
            console.log(error)
            setUserMsg('Error saving event.');
            throw error;
        }

    }

    const handleAssignVolunteer = async () => {
       
        if (taskId < 0 || assignedVolunteer === '0') 
            {
                setUserMsg('Please create a task first');
                return;
            }
        const volunteerIdInt = typeof assignedVolunteer === 'string' ? parseInt(assignedVolunteer, 10) : assignedVolunteer;
        console.log("taskID, volunteerId", taskId," ", volunteerIdInt)
        try {
            const response = await fetch(`${API_BASE_URL}/api/task/assignVolunteer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, volunteerId: volunteerIdInt }),
            });

            const result = await response.json();
        
            if (response.ok) {
                console.log(result.message)
                setUserMsg(result.message);
                setIsVolunteerAssigned(true);
            } else {
                setUserMsg('Failed to assign volunteer.');
            }
        } catch (error) {
            console.error('Error assigning volunteer:', error);
            setUserMsg('Error assigning volunteer.');
        }
    };
    const handleSendNotifications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/task/notifyVolunteers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId }),
            });

            const result = await response.json();
            if (response.ok) {
                setNotificationSent(true);
                console.log(response.message);
                setUserMsg('Notifications sent successfully!', result.message);
            } else {
                setUserMsg('Failed to send notifications.');
            }
        } catch (error) {
            console.error('Error sending notifications:', error);
            setUserMsg('Error sending notifications.');
        }
    };

    return (
        <>
        <Modal show={show} onHide={handleModalClose} className="modal" style={{ maxHeight: 'calc(100vh)', overflowY: 'auto' }}>
        <form onSubmit={handleSave}>
            <Modal.Header>
                <Modal.Title>New Event Details</Modal.Title>
            </Modal.Header>
            
            <Modal.Body >
                
                    <div className="form-group">
                        <label htmlFor="eventname" className="form-label">Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.eventName ? 'is-invalid' : ''}`} 
                            id="eventname"
                            name="eventName"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={handleChange}
                                
                        />
                        {errors.eventName && <div className="invalid-feedback">{errors.eventName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                            id="description"
                            name="description"
                            placeholder="Brief description of task"
                            value={description}
                            onChange={handleChange}
                            
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskType" className="form-label">Task Type</label>
                        <select name="taskType" id="taskType" 
                            onChange={handleChange}
                            value={taskType} 
                            className={`form-select ${errors.taskType ? 'is-invalid' : ''}`} 
                        >
                            <option value="0"> -- select an option -- </option>
                                {taskTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.type_name}
                                    </option>
                                ))}
                        </select>
                        {errors.taskType && <div className="invalid-feedback">{errors.taskType}</div>}
                       
                    </div>
                    <div className="form-group">
                        <label>Task Frequency</label>
                        <div  className="form-check">
                            <input 
                                type="radio" 
                                name="taskFreq"
                                id="taskFreq1"
                                value="false"
                                className={`radio-new-task ${errors.taskFreq ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                checked={taskFreq === false}
                                                       
                            />
                            <label className="form-check-label" htmlFor="taskFreq1">
                            One Time Task
                            </label>
                        
                            <input 
                                type="radio"
                                name="taskFreq"
                                id="taskFreq2"
                                value='true'
                                className={`radio-new-task ${errors.taskFreq ? 'is-invalid' : ''}`}
                                onChange={handleChange} 
                                checked={taskFreq === true}
                            />
                             <label className="form-check-label" htmlFor="taskFreq2">
                            Recurring Task
                        </label>
                        {errors.taskFreq && <div className="invalid-feedback">{errors.taskFreq}</div>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskShift" className="form-label">Shift</label>                        
                        <select name="taskShift" 
                            id="taskShift"
                            className={`form-select ${errors.taskShift ? 'is-invalid' : ''}`} 
                            onChange={handleChange}
                            value={taskShift}
                            
                            >
                            <option value="0"> -- select an option -- </option>
                                {shifts.map((shift) => (
                                    <option key={shift.id} value={shift.id}>
                                        {`${shift.day} ${shift.time}`}
                                    </option>
                                ))}
                        </select>
                        {errors.taskShift && <div className="invalid-feedback">{errors.taskShift}</div>}
                    
                    </div>
                    <div className="form-group">
                        <label htmlFor="date" className="form-label">Date</label>
                        <DatePicker 
                            className={`datetimepicker ${errors.startDate ? 'is-invalid' : ''}`} 
                            selected={startDate}
                            onChange={(date) => setStartDate(date)} 
                            minDate={new Date()}
                            id="date" 
                            dateFormat="yyyy/MM/dd"
                            required
                            />
                           
                    </div>

                    <div className="form-group">
                        <label htmlFor="time" className="form-label">Time</label>
                        <DatePicker
                            className={'datetimepicker'} 
                            selected={startTime}
                            onChange={(time) => {setStartTime(time)}}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                          //  minTime={new Date(0, 0, 0, 6, 0)} 
                          //  maxTime={new Date(0, 0, 0, 21, 0)} 
                            id="time"
                            dateFormat="h:mm aa"
                            required
                            />
                            
                    </div>
                    
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            className={`form-control ${errors.location ? 'is-invalid' : ''}`} 
                            name="location"
                            value={location}
                            placeholder="Location of task"
                            onChange={handleChange}
                        />
                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                    </div>
                    <div className="my-2">
                        <Button  
                            variant="primary" 
                            type="submit"
                            disabled={taskCreated}
                            >
                            Save
                        </Button>
                    </div>
                    <hr />
                    {taskCreated && (
                        <>
                            <div className="alert alert-success mt-3">
                                Task created successfully! You can now assign a volunteer or send notifications to volunteers that might be interested in the task
                            
                            </div>   
                        
                            <hr />
                     
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="assignVolunteer" className="form-label">Assign Volunteer</label>
                        <select 
                            id="assignVolunteer" 
                            className="form-select" 
                            value={assignedVolunteer} 
                            onChange={(e) => setAssignedVolunteer(e.target.value)}
                            disabled={!taskCreated}  
                        >
                            <option value="0"> -- Select a volunteer -- </option>
                            {volunteers.map(volunteer => (
                                <option key={volunteer.id} value={volunteer.id}>
                                    {volunteer.first_name} {volunteer.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="my-2">
                        <Button 
                            variant="primary" 
                            onClick={handleAssignVolunteer} 
                            disabled={!taskCreated || isVolunteerAssigned}
                        >
                            Assign volunteer
                        </Button>
                        <hr />
                    </div>
                    <div className="my-2">
                        <Button 
                            variant="primary" 
                            onClick={handleSendNotifications} 
                            disabled={!taskCreated || isVolunteerAssigned}
                        >
                            Send Notifications
                        </Button>
                    </div>
                    
                    
            </Modal.Body>
            <Modal.Footer>
                <span className="error">{usermsg}</span>
                <Button 
                    variant="secondary" 
                    onClick={handleModalClose}
                    
                    >
                    Close
                </Button>
               
                
                
            </Modal.Footer>
            </form>
        </Modal>
        
        </>
    );
};


export default NewEvent;