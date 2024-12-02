import React, { useState, useEffect } from "react";
import { Modal, Button, Form  } from 'react-bootstrap';
import API_BASE_URL from "../config";

const EventInfo = ({ event, show, handleClose, backdrop, keyboard }) => {
    const [isEditMode, setIsEditMode] = useState(false); // Track if fields are editable
    const [editableEvent, setEditableEvent] = useState({
       
        name: '',
        description: '',
        taskType: null,
        day: '',
        time: '',
        location: '',
        volunteer: null
        
    });

    const [showAvailableVolunteers, setShowAvailableVolunteers] = useState(false);
    const [availableVolunteers, setAvailableVolunteers] = useState([]); 
    const [isVolunteerAssigned, setIsVolunteerAssigned] =useState(false);
    const [volunteerAssigned, setVolunteerAssigned] = useState(null);
    const [notificationSent, setNotificationSent] = useState(false); 
    const [selectedVolunteer, setSelectedVolunteer] = useState(null); 
    const [volunteers, setVolunteers] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [shifts, setShifts] = useState([]);

    const [reloadFlag, setReloadFlag] = useState(false);
   
  
    const handleModalClose = () => {
        setIsEditMode(false);
        handleClose(reloadFlag);
        setReloadFlag(true); 
    };

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

    
    useEffect(() => {
       
        if (event) {
            
            console.log("Event ID:", event);
            setEditableEvent({
                
                name: event.name,
                description: event.description,
                taskType: event.task_type,
                day: event.start_date,
                time: event.start_time,
                isRecurring: event.is_recurring,
                location: event.location,
                volunteer: (event.assignment && event.assignment.length > 0)?event.assignment[0].volunteer:null 
            });
        
          
            if(event.assignment && event.assignment.length > 0){
                console.log("event assignment ", event.assignment),
                console.log("vol ", event.assignment[0].volunteer),
                setVolunteerAssigned(event.assignment[0].volunteer); 
                setSelectedVolunteer(event.assignment[0].volunteer);
                setIsVolunteerAssigned(true);
            }
            else {
                setVolunteerAssigned(null);
                setSelectedVolunteer(null);
                setIsVolunteerAssigned(false);
                fetchAvailableVolunteers(event.id);
            }
            
           
        }
                  
        console.log("Init assigned volunteer", volunteerAssigned);
    }, [event]);
    if (!event) return null; // Avoid rendering if no event is selected

   // Fetch available volunteers for the event
   const fetchAvailableVolunteers = async (taskId) => {
        if (!taskId) {
            console.error("Invalid taskId for fetching volunteers");
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/confirmation/availableVolunteers/${taskId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch available volunteers.");
            }
            const data = await response.json();
            setAvailableVolunteers(data); 
            
        } catch (error) {
            console.error("Error fetching available volunteers:", error);
        }
   };

    // Handle changes to input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableEvent((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const toggleEditMode = async () => {
        if (isEditMode) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/events/${event.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: editableEvent.name,
                        description: editableEvent.description,
                        taskType: editableEvent.taskType?.id, // Ensure it's the ID
                        day: editableEvent.day,
                        time: editableEvent.time,
                        location: editableEvent.location,
                    }),
                });
    
                if (response.ok) {
                    const updatedEvent = await response.json();
                    setReloadFlag(true);
                    alert('Event updated successfully!');
                } else {
                    throw new Error('Failed to update event.');
                }
            } catch (error) {
                console.error('Error updating event:', error);
                alert('Error updating event. Please try again.');
            }
        }
        setIsEditMode(!isEditMode);
    };
    

    // Handle assigning a volunteer
    const handleAssignVolunteer = async () => {
        if (!selectedVolunteer) {
            alert("Please select a volunteer to assign.");
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/task/assignVolunteer`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        taskId: event.id,
                        volunteerId: selectedVolunteer.id,
                    }),
                }
            );
            if (response.ok) {
                const updatedEvent = await response.json();
             //   const volunteer = selectedVolunteer.volunteer;
                setVolunteerAssigned(selectedVolunteer); 
             
                setIsVolunteerAssigned(true);
                
                handleNotifyVolunteer();
                
                alert("Volunteer assigned successfully.");
            } else {
                throw new Error("Failed to assign volunteer.");
            }
        } catch (error) {
            console.error("Error assigning volunteer:", error);
        }
    };
    const handleNotifyVolunteer = async () => {
        const day = new Date(event.start_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
      // Convert start_time to 12-hour format with AM/PM
        const [hour, minute] = event.start_time.split(':');
          const date = new Date();
          date.setHours(hour, minute);
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      
    
    
        console.log("selected volunteer", selectedVolunteer);
        const message = `
                    <p><strong>You are assigned to the task: ${event.name}</strong></p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Date:</strong> ${day}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Description:</strong> ${event.description}</p>
                    <p>Thank you</p>
                `;
               
                console.log("message", message);
                
                console.log("selectedVolunteer", selectedVolunteer);
                try {
            

                    const notificationResponse = await fetch(`${API_BASE_URL}/api/notification/send`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ volunteers:[selectedVolunteer], message })
                    });
                    if (notificationResponse.ok) {
                        alert("Volunteer assigned and notification sent successfully.");
                    } else {
                        throw new Error("Failed to send notification.");
                    }
                    
                } catch (error) {
                    console.error("Error sending notification:", error);
                }
                
    }
    const handleSelectChange = (e, fieldName) => {

        const { value } = e.target;

        setEditableEvent(prev => ({
            ...prev,
            [fieldName]: taskTypes.find((taskType) => taskType.id === parseInt(value, 10)),
        }));
    };
    const handleVolunteerSelection = async (e) => {
        const selectedId = parseInt(e.target.value, 10);
        console.log("selected id",selectedId); 
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/volunteerDetails/${selectedId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const volunteerDetails = await response.json();
                console.log("Selected volunteer details:", volunteerDetails);
                setSelectedVolunteer(volunteerDetails); // Set the selected volunteer details
            } else {
                throw new Error("Failed to fetch volunteer details.");
            }
        } catch (error) {
            console.error("Error fetching volunteer details:", error);
        }
      
    };
   
    // Handle sending notifications to matching volunteers
    const handleSendNotification = async (taskId) => {
        if (!taskId) {
            console.error("Invalid taskId for notification");
            return;
        }
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
                setNotificationSent(true); // Mark notification as sent
                alert('Notifications sent successfully!', result.message);
            } else {
                throw new Error("Failed to send notification.");
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    };

    const handleToggleAvailableVolunteers = () => {
        setShowAvailableVolunteers((prev) => !prev);
    };

    const [hour, minute] = editableEvent.time.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return (
  
        <>
        <Modal show={show} 
        onHide={handleModalClose} 
        className="modal"
        backdrop={backdrop}
        keyboard={keyboard}
        >
            <Modal.Header closeButton>
                <Modal.Title>Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group my-2">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name" 
                            value={editableEvent.name}
                            
                            
                            onChange={handleChange} 
                            disabled={!isEditMode}
                       />
                    </div>
                    <div className="form-group my-2">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={editableEvent.description}
                            disabled={!isEditMode}
                           
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group my-2">
                        
                        <label htmlFor="taskType">Task type </label>
                            <select
                                id="taskType"
                                className="form-select"
                                name="taskType" 
                                value={editableEvent.taskType ?editableEvent.taskType.id : ''}
                            
                                disabled={!isEditMode}
                                //disabled={true}
                                
                                onChange={(e) => handleSelectChange(e, "taskType")}
                            
                            >
                                {taskTypes.map((taskType) => (
                                    <option key={taskType.id} value={taskType.id}>
                                        {taskType.type_name}
                                    </option>
                                ))}
                            </select>
                       
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="taskDay" className="form-label">Day
                            <input
                                id="taskDay"
                                type="text"
                                className="form-control"
                                name="day"
                                value={editableEvent.day || ''}
                                disabled={!isEditMode}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="taskTime" className="form-label">Time
                            <input
                                id="taskTime"
                                type="text"
                                className="form-control"
                                name="time"
                                value={time || ''}
                              
                                disabled={true}
                          
                            />
                        </label>
                    </div>
                    <div className="radio-group my-2">
                        <label>Task Frequency</label>
                        <div>
                            <label className="form-check-label" htmlFor="eventFrequency1">
                            <input
                                id="eventFrequency1"
                                type="radio"
                                name="eventFrequency"
                                value="oneTime"
                                className="radio-new-task"
                                checked={editableEvent.isRecurring === false}
                           
                                disabled={true}
                                onChange={() =>
                                    setEditableEvent((prev) => ({
                                        ...prev,
                                        isRecurring: false, 
                                    }))
                                }
                            />
                            One-Time Task
                            </label>
                            <label className="form-check-label" htmlFor="eventFrequency2">
                            <input
                                id="eventFrequency2"
                                type="radio"
                                name="eventFrequency"
                                value="recurring"
                                className="radio-new-task"
                                checked={editableEvent.isRecurring === true}
                          
                                disabled={true}
                                onChange={() =>
                                    setEditableEvent((prev) => ({
                                        ...prev,
                                        isRecurring: true, 
                                    }))
                                }
                            />
                            Recurring Task
                            </label>
                        </div>
                        </div>
                    <div className="form-group my-2">
                        <label htmlFor="taskLocation">Location</label>
                            <input
                                id="taskLocation"
                                type="text"
                                className="form-control"
                                name="location"
                                value={editableEvent.location || ''}
                                disabled={!isEditMode}
                                
                                onChange={handleChange}
                            />
                        
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="assignedVolunteer" className="form-label"> Assigned Volunteer
                            <select
                                id="assignedVolunteer" 
                                className="form-select"
                                value={selectedVolunteer?selectedVolunteer.id :""}
                                onChange={handleVolunteerSelection} 
                           
                                disabled={true}
                            >
                                <option value="">-- Select a Volunteer --</option>
                                {volunteers.map(volunteer => (
                                    <option key={volunteer.id} value={volunteer.id}>
                                        {volunteer.first_name} {volunteer.last_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                
                        
                     
                    </div>
                    <div className="form-group my-2">
                        
                        {availableVolunteers.length === 0 ? (
                            <Button
                                variant="primary"
                                onClick={() => handleSendNotification(event.id)}
                                disabled={notificationSent || isVolunteerAssigned}
                            >
                                Send Notification to Volunteers
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={handleToggleAvailableVolunteers}
                                >
                                    {showAvailableVolunteers ? 'Hide' : 'View'} Available Volunteers
                                </Button>
                                
                                {/* Show the list if `showAvailableVolunteers` is true */}
                                {showAvailableVolunteers && (
                                    <div>
                                        <select 
                                            className="form-select" 
                                            onChange={handleVolunteerSelection} 
                                            value={selectedVolunteer ? selectedVolunteer.id : ''}
                                        >
                                            <option value="">Select a volunteer</option>
                                            {availableVolunteers.map((volunteer) => (
                                                <option key={volunteer.volunteer.id} value={volunteer.volunteer.id}>
                                                    {volunteer.volunteer.first_name} {volunteer.volunteer.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            variant="success"
                                            onClick={handleAssignVolunteer}
                                            disabled={!selectedVolunteer}
                                        >
                                            Assign Selected Volunteer
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={toggleEditMode}>
                    {isEditMode ? 'Save' : 'Edit'}
                </Button>
            </Modal.Footer>
        </Modal>
        
        </>
    );
  
};

export default EventInfo;