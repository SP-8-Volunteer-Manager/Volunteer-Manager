import React, { useState, useEffect } from "react";

import { Modal, Button } from 'react-bootstrap';



const EventInfo = ({ event, show, handleClose }) => {
    const [isEditMode, setIsEditMode] = useState(false); // Track if fields are editable
    const [editableEvent, setEditableEvent] = useState({
        name: '',
        description: '',
        taskType: '',
        day: ''

        
    });



   
    const handleModalClose = () => {
        handleClose(); 
    };

   
    
    useEffect(() => {
       
        if (event) {
            setEditableEvent({
                name: event.name,
                description: event.description,
                taskType: event.task_type.type_name,
                day: event.day
                
            });
        }
    }, [event]);

    // Handle changes to input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableEvent((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const toggleEditMode = () => {
        if (isEditMode) {
          
            console.log('Saving event info:', editableEvent);
        }
        setIsEditMode(!isEditMode);
    };

    if (!event) return null; 

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
                        <label>Task Preferences</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Task Preferences" 
                            value={(editableEvent["Task Preferences"] || []).join(', ') || ''}
                            disabled={!isEditMode}
                           
                            onChange={handleChange} 
                        />
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