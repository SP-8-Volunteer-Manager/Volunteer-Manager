import React, { useState, useEffect } from "react";
import StateDropdown from './StateDropdown';
import CarrierDropdown from "./CarrierDropdown";
import ShiftCheckbox from "./ShiftCheckbox";
import { Modal, Button } from 'react-bootstrap';
import NotificationModal from './NotificationModal';
import Select from 'react-select';


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
    const [scheduleOptions, setScheduleOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);

{/*    const handleSendNotification = (message) => {
        console.log("Sending notification:", message);
        
       
    };
    */}
    const handleModalClose = () => {
        handleClose(); 
        setShowNotificationModal(false); 
    };

   // Fetch options for schedule and task preferences
   useEffect(() => {
    const fetchOptions = async () => {
        try {
            const scheduleResponse = await fetch(`http://localhost:8080/api/admin/scheduleOptions`);
            if (!scheduleResponse.ok) {
                throw new Error(`Failed to fetch schedule options, status: ${scheduleResponse.status}`);
            }
            const scheduleData = await scheduleResponse.json();
            setScheduleOptions(scheduleData.map(option => ({
                value: `${option.day} ${option.time}`,
                label: `${option.day} ${option.time}`
            })));

            const taskResponse = await fetch(`http://localhost:8080/api/admin/taskOptions`);
            if (!taskResponse.ok) {
                throw new Error(`Failed to fetch task options, status: ${taskResponse.status}`);
            }
            const taskData = await taskResponse.json();
            setTaskOptions(taskData.map(option => ({
                value: option.type_name,
                label: option.type_name
            })));
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };
    fetchOptions();
}, []);

    {/* useEffect(() => {
       
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
         */}
   
    useEffect(() => {
        if (volunteer) {
            setEditableVolunteer({
                name: `${volunteer.first_name} ${volunteer.last_name}`,
                "Phone number": volunteer.phone,
                email: volunteer.User.email,
                "Schedule Preferences": volunteer.shift_prefer.map(shift => ({
                    value: `${shift.shift.day} ${shift.shift.time}`,
                    label: `${shift.shift.day} ${shift.shift.time}`
                })),
                "Task Preferences": volunteer.task_prefer.map(task => ({
                    value: task.task_type.type_name,
                    label: task.task_type.type_name
                }))
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
    
    // Handle changes to multiple select dropdowns
    const handleMultiSelectChange = (selectedOptions, field) => {
        setEditableVolunteer(prev => ({
            ...prev,
            [field]: selectedOptions || []
        }));
    };

    // Function to save changes to backend
    const handleSave = async () => {
        const updateData = {
            volunteerData: {
                name: editableVolunteer.name,
                phone: editableVolunteer["Phone number"],
                email: editableVolunteer.email,
            },
            schedulePreferences: editableVolunteer["Schedule Preferences"].map(pref => {
                const [day, time] = pref.split(' '); 
                return { day, time };
            }),
            taskPreferences: editableVolunteer["Task Preferences"].map(type_name => ({ type_name })),
        };

        try {
            const response = await fetch(`/api/admin/volunteers/${volunteer.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) throw new Error('Failed to update volunteer');
            alert('Volunteer information updated successfully');
        } catch (error) {
            console.error(error);
            alert('Error updating volunteer');
        }
    };
    const toggleEditMode = () => {
        if (isEditMode) {
            handleSave();         
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
                    {/*  <div className="form-group">
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
                    </div>*/}
                    {/* Schedule Preferences Dropdown */}
                    <div className="form-group">
                            <label>Schedule Preferences</label>
                            <Select
                                isMulti 
                                options={scheduleOptions}
                                value={editableVolunteer["Schedule Preferences"]}
                                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "Schedule Preferences")}
                                isDisabled={!isEditMode}
                            />
                        </div>
                    {/* Task Preferences Multi-select */}
                    <div className="form-group">
                            <label>Task Preferences</label>
                            <Select
                                isMulti 
                                options={taskOptions}
                                value={editableVolunteer["Task Preferences"]}
                                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "Task Preferences")}
                                isDisabled={!isEditMode}
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