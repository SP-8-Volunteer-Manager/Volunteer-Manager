import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



const NotificationModal = ({ show, handleClose,  volunteers }) => {
  
    const [message, setMessage] = useState('');
    const [messageSent, setMessageSent] = useState(false); // State to track if message was sent
    
    const namesList = Array.isArray(volunteers)
        ? volunteers.map(volunteer => `${volunteer.first_name} ${volunteer.last_name}`)
        : [`${volunteers.first_name} ${volunteers.last_name}`];


    //const name = `${volunteer.first_name} ${volunteer.last_name}`;
    const handleSubmit = async (e) => {
        e.preventDefault();
  //      handleSend(message);
        await handleSendNotification();
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
          {/*  const { receive_phone: sms,
                    receive_email: email,
                    phone: phoneNumber,
                    consent_for_sms: optInSms,
                    consent_for_email: optInEmail, 
                    carrier} = volunteer;
            
             */} 
       //     if (sms && optInSms) {
        //        console.log("Request body:", { phoneNumber, carrier, message, optInSms });
                await fetch('http://localhost:8080/api/notification/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ volunteers, message })
                });
           // }
           
        } catch (error) {
            console.error("Error sending notification:", error);
        }
        
       
    };

    return (
        <Modal show={show} onHide={handleModalClose} className="modal-dialog">
            <Modal.Header closeButton>
                Send Notification to {Array.isArray(volunteers) ? 'Selected Volunteers' : namesList[0]}
            </Modal.Header>
            <Modal.Body>
                <p>Sending to:</p>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                    {namesList.map((name, index) => (
                        <p key={index} style={{ margin: '0' }}>{name}</p>
                    ))}
                </div>
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
                        <p>Your message to {name} has been sent!</p>
                        <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>

    );
};

export default NotificationModal;