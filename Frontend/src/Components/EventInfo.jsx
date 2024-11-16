import React, { useState, useEffect } from "react";

import { Modal, Button, Form  } from 'react-bootstrap';
import API_BASE_URL from "../config";

const EventInfo = ({ event, show, handleClose }) => {
    const [isEditMode, setIsEditMode] = useState(false); // Track if fields are editable
    const [editableEvent, setEditableEvent] = useState({
       
        name: '',
        description: '',
        taskType: '',
        day: '',
        time: '',
        location: ''
        
    });

    const [showAvailableVolunteers, setShowAvailableVolunteers] = useState(false);
    const [availableVolunteers, setAvailableVolunteers] = useState([]); 
    const[isVolunteerAssigned, setIsVolunteerAssigned] =useState(false);
    const [volunteerAssigned, setVolunteerAssigned] = useState(null);
    const [notificationSent, setNotificationSent] = useState(false); 
    const [selectedVolunteer, setSelectedVolunteer] = useState(null); 
   
  
    const handleModalClose = () => {
        handleClose(); 
    };

   
    
    useEffect(() => {
       
        if (event) {
            
            console.log("Event ID:", event);
            setEditableEvent({
                
                name: event.name,
                description: event.description,
                taskType: event.task_type.type_name,
                day: event.start_date,
                time: event.start_time,
                location: event.location

                
            });
            console.log("Event ID:", event.id); 
            console.log("assignment ",event.assignment);
          
            if(event.assignment && event.assignment.length > 0){
                setVolunteerAssigned(event.assignment[0].volunteer); // Check if a volunteer is assigned
                setIsVolunteerAssigned(true);
            }
            else {
                setVolunteerAssigned(null);
                setIsVolunteerAssigned(false);
                fetchAvailableVolunteers(event.id);
            }
            
                     
            console.log("Init assigned volunteer", volunteerAssigned);
        }
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
            // Save event details to the backend
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/events/${event.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: editableEvent.name,
                        description: editableEvent.description,
                        taskType: editableEvent.taskType, // Ensure taskType is passed correctly
                        day: editableEvent.day,
                        time: editableEvent.time,
                        location: editableEvent.location,
                    }),
                });
    
                if (response.ok) {
                    const updatedEvent = await response.json();
                    alert('Event updated successfully!');
                    // Update the UI if necessary
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
      
        // const time = new Date(`1970-01-01T${event.start_time}Z`).toLocaleTimeString("en-US", {
        //     hour: "numeric",
        //     minute: "2-digit",
        //     hour12: true,
        //     timeZone: "UTC"
        // });
    
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
        <Modal show={show} onHide={handleClose} className="modal-dialog">
            <Modal.Header closeButton>
                <Modal.Title>Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
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
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={editableEvent.description}
                            disabled={!isEditMode}
                           
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Task type</label>
                        <input
                            type="text"
                            className="form-control"
                            name="taskType" 
                            value={editableEvent.taskType || ''}
                            disabled={!isEditMode}
                            
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Day</label>
                        <input
                            type="text"
                            className="form-control"
                            name="day"
                            value={editableEvent.day || ''}
                            disabled={!isEditMode}
                            
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time</label>
                        <input
                            type="text"
                            className="form-control"
                            name="time"
                            value={time || ''}
                            disabled={!isEditMode}
                            
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            className="form-control"
                            name="location"
                            value={editableEvent.location || ''}
                            disabled={!isEditMode}
                            
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Assigned Volunteer</label>
                        {volunteerAssigned ? (
                            <p>{volunteerAssigned.first_name} {volunteerAssigned.last_name}</p>
                        ) : (
                            <p>No volunteer assigned</p>
                        )}
                    </div>
                    <div className="form-group">
                        
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