import React, { useState, useEffect } from "react";
import StateDropdown from './StateDropdown';
import CarrierDropdown from "./CarrierDropdown";
import ShiftCheckbox from "./ShiftCheckbox";
import { Modal, Button } from 'react-bootstrap';
import NotificationModal from './NotificationModal';


const VolunteerInfo = ({ volunteer, show, handleClose }) => {
    const [isEditMode, setIsEditMode] = useState(false); // Track if fields are editable
    const [editableVolunteer, setEditableVolunteer] = useState({
        name: '',
        "Phone number": '',
        email: '',
        "Schedule Preferences": [],
        "Task Preferences": []
    });

    const [showNotificationModal, setShowNotificationModal] = useState(false);

{/*    const handleSendNotification = (message) => {
        console.log("Sending notification:", message);
        
       
    };
    */}
    const handleModalClose = () => {
        handleClose(); 
        setShowNotificationModal(false); 
    };

   
    
    useEffect(() => {
       
        if (volunteer) {
            setEditableVolunteer({
                name: `${volunteer.first_name} ${volunteer.last_name}`,
                "Phone number": volunteer.phone,
                email: volunteer.User.email,
                "Schedule Preferences": volunteer.shift_prefer.map(shift => `${shift.shift.day} ${shift.shift.time}`) || [],
                "Task Preferences": volunteer.task_prefer.map(task => task.task_type.type_name) || [], 
            });
        }
    }, [volunteer]);

    // Handle changes to input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableVolunteer((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const toggleEditMode = () => {
        if (isEditMode) {
          
            console.log('Saving volunteer info:', editableVolunteer);
        }
        setIsEditMode(!isEditMode);
    };

    if (!volunteer) return null; 

    return (
        <>
        <Modal show={show} onHide={handleClose} className="modal-dialog">
            <Modal.Header closeButton>
                <Modal.Title>Volunteer Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name" 
                            value={editableVolunteer.name}
                            
                            
                            onChange={handleChange} 
                            disabled={!isEditMode}
                       />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Phone number"
                            value={editableVolunteer["Phone number"]}
                            disabled={!isEditMode}
                           
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email" 
                            value={editableVolunteer.email || ''}
                            disabled={!isEditMode}
                            
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Schedule Preferences</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Schedule Preferences"
                            value={(editableVolunteer["Schedule Preferences"] || []).join(', ') || ''}
                            disabled={!isEditMode}
                            
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Task Preferences</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Task Preferences" 
                            value={(editableVolunteer["Task Preferences"] || []).join(', ') || ''}
                            disabled={!isEditMode}
                           
                            onChange={handleChange} 
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    onClick={() => setShowNotificationModal(true)} 
                >
                    Send Notification
                </Button>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={toggleEditMode}>
                    {isEditMode ? 'Save' : 'Edit'}
                </Button>
            </Modal.Footer>
        </Modal>
        {/* Notification Modal */}
        
                <NotificationModal 
                    show={showNotificationModal}
                    handleClose={() => setShowNotificationModal(false)}
              //      handleSend={handleSendNotification}
                    volunteers={volunteer}
                />
       
        </>
    );
};


export default VolunteerInfo;