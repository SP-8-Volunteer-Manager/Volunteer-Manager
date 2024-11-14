import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../config';

const TaskConfirmationPage = () => {
    const { taskId, volunteerId } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmationStatus, setConfirmationStatus] = useState(null);

    useEffect(() => {
        // Fetch task details
        const fetchTask = async () => {
            try {
                console.log("taskID", taskId)
                const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`);
                
                if (!response.ok) throw new Error("Failed to fetch task details");
                const data = await response.json();
                setTask(data);
            } catch (error) {
                console.error("Error fetching task:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleConfirm = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/confirmation/confirmAvailability?taskId=${taskId}&volunteerId=${volunteerId}`);
            if (!response.ok) throw new Error("Failed to confirm availability");
            const data = await response.json();
            //setConfirmationStatus("Your confirmation has been received. If you are assigned to this task, you will receive an additional notification.");
            setConfirmationStatus(data.message);
        } catch (error) {
            console.error("Error confirming availability:", error);
            setConfirmationStatus("An error occurred while confirming. Please try again later.");
        }
    };

    if (loading) return <p>Loading task details...</p>;
    const [hour, minute] = task.start_time.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return (
        <div className="container">
            {task ? (
                <div>
                    <h2>Task Confirmation</h2>
                    <p><strong>Task:</strong> {task.name}</p>
                    <p><strong>Location:</strong> {task.location}</p>
                    <p><strong>Date:</strong> {task.start_date}</p>
                    <p><strong>Time:</strong> {time}</p>
                    <p><strong>Description:</strong> {task.description}</p>
                    {confirmationStatus ? (
                        <p>{confirmationStatus}</p>
                    ) : (
                        <button className="btn btn-primary" onClick={handleConfirm}>Confirm Availability</button>
                    )}
                </div>
            ) : (
                <p>Task not found.</p>
            )}
        </div>
    );
};

export default TaskConfirmationPage;