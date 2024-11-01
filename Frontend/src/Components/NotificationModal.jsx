import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



const NotificationModal = ({ show, handleClose, handleSend, volunteer }) => {

    const [message, setMessage] = useState('');
    const [messageSent, setMessageSent] = useState(false); // State to track if message was sent
    const name = `${volunteer.first_name} ${volunteer.last_name}`;
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
    const handleSendNotification = async () => {
        console.log("Sending notification:", message);
        try {
            const { receive_phone: sms,
                    receive_email: email,
                    phone: phoneNumber,
                    consent_for_sms: optInSms,
                    consent_for_email: optInEmail, 
                    carrier} = volunteer;
            
                console.log({phoneNumber});
                console.log({carrier});
                console.log({message});
                console.log({optInSms});
            if (sms && optInSms) {
                console.log("Request body:", { phoneNumber, carrier, message, optInSms });
                await fetch('http://localhost:8080/api/notification/send-sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phoneNumber, carrier, message, optInSms })
                });
            }
           
        } catch (error) {
            console.error("Error sending notification:", error);
        }
        
       
    };

    return (
        <Modal show={show} onHide={handleModalClose} className="modal-dialog">
            <Modal.Header closeButton>
                <Modal.Title>Send Notification to {name}</Modal.Title>
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
                        <Button type="submit" className="btn btn-primary" onClick={handleSendNotification}>Send</Button>
                        <Button variant="secondary" onClick={handleModalClose} className="ms-2">Cancel</Button>
                    </form>
                ) : (
                    <div>
                        <p>Your message to {name} has been sent!</p>
                        <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>

    );
};

export default NotificationModal;