import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const NotificationModal = ({ show, handleClose, handleSend, volunteerName }) => {
    const [message, setMessage] = useState('');
    const [messageSent, setMessageSent] = useState(false); // State to track if message was sent

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend(message);
        setMessageSent(true); // Update state to indicate message was sent
        setMessage(''); // Reset the message field after sending
    };

    const handleModalClose = () => {
        handleClose(); // Close the modal
        setMessage(''); // Reset the message field
        setMessageSent(false); // Reset message sent status
    };
    

    return (
        <Modal show={show} onHide={handleModalClose} className="modal-dialog">
            <Modal.Header closeButton>
                <Modal.Title>Send Notification to {volunteerName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!messageSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="notificationMessage" className="form-label">
                                Message:
                            </label>
                            <textarea
                                id="notificationMessage"
                                className="form-control"
                                rows="3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <Button type="submit" className="btn btn-primary">Send</Button>
                        <Button variant="secondary" onClick={handleModalClose} className="ms-2">Cancel</Button>
                    </form>
                ) : (
                    <div>
                        <p>Your message to {volunteerName} has been sent!</p>
                        <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>

    );
};

export default NotificationModal;