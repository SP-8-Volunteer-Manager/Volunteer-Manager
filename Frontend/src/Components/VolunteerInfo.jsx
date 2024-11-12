import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import NotificationModal from './NotificationModal';
import Select from 'react-select';
import API_BASE_URL from '../config';

const VolunteerInfo = ({ volunteer, show, handleClose }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableVolunteer, setEditableVolunteer] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        "Schedule Preferences": [],
        "Task Preferences": []
    });

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [scheduleOptions, setScheduleOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);

    const handleModalClose = () => {
        handleClose();
        setShowNotificationModal(false);
    };

    // Fetch options for schedule and task preferences
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const scheduleResponse = await fetch(`${API_BASE_URL}/api/admin/scheduleOptions`);
                if (!scheduleResponse.ok) {
                    throw new Error(`Failed to fetch schedule options, status: ${scheduleResponse.status}`);
                }
                const scheduleData = await scheduleResponse.json();
                console.log('schedule data', scheduleData);
                setScheduleOptions(scheduleData.map(option => ({
                    key: option.id,
                    value: option.id,
                    label: `${option.day} ${option.time}`
                })));
                
                const taskResponse = await fetch(`${API_BASE_URL}/api/admin/taskOptions`);
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
        console.log("schedule options", scheduleOptions);
    }, []);

    // Load volunteer data into editable state when component mounts or volunteer changes
    useEffect(() => {
        if (volunteer) {
            setEditableVolunteer({
                first_name: volunteer.first_name || '',
                last_name: volunteer.last_name || '',
                phone: volunteer.phone || '',
                email: volunteer.email || '',
                "Schedule Preferences": volunteer.shift_prefer ? volunteer.shift_prefer.map(shift => ({
                    value: shift.shift.id,
                    label: `${shift.shift.day} ${shift.shift.time}`
                })) : [],
                "Task Preferences": volunteer.task_prefer ? volunteer.task_prefer.map(task => ({
                    value: task.task_type.type_name,
                    label: task.task_type.type_name
                })) : []
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
        if (!volunteer || !volunteer.id) {
            console.error('Volunteer ID is not available');
            return;
        }

        const updateData = {
            volunteerData: {
                first_name: editableVolunteer.first_name,
                last_name: editableVolunteer.last_name,
                phone: editableVolunteer.phone,
                email: editableVolunteer.email,
            },
            schedulePreferences: editableVolunteer["Schedule Preferences"].map(pref => ({
                shift_id: pref.value 
            })),
            taskPreferences: editableVolunteer["Task Preferences"].map(pref => ({
                type_name: pref.label
            })),
        };
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/info/${volunteer.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Update result:', result);
                alert('Volunteer information updated successfully');
            } else {
                console.error('Failed to update volunteer:', response.statusText);
                alert('Error updating volunteer');
            }
        } catch (error) {
            console.error('Error:', error);
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
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="first_name"
                                value={editableVolunteer.first_name}
                                onChange={handleChange}
                                disabled={!isEditMode}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="last_name"
                                value={editableVolunteer.last_name}
                                onChange={handleChange}
                                disabled={!isEditMode}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={editableVolunteer.phone}
                                onChange={handleChange}
                                disabled={!isEditMode}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={editableVolunteer.email || ''}
                                onChange={handleChange}
                                disabled={!isEditMode}
                            />
                        </div>
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
                    <Button onClick={() => setShowNotificationModal(true)}>
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
            <NotificationModal
                show={showNotificationModal}
                handleClose={() => setShowNotificationModal(false)}
                volunteers={volunteer}
            />
        </>
    );
};

export default VolunteerInfo;
