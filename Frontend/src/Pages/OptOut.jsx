import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../config';
import Navigation from '../Components/Navigation'

const OptOut = () => {
    const { volunteerId } = useParams();
    const [receivePhone, setReceivePhone] = useState(true);
    const [receiveEmail, setReceiveEmail] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the user is opting out from both SMS and Email
        if (!receivePhone && !receiveEmail) {
            setShowConfirmModal(true);
        } else {
            await updateOptOutPreferences();
        }
    };

    const updateOptOutPreferences = async () => {
        const data = { volunteerId, receivePhone, receiveEmail };
        console.log("data", data);

        try {
            const response = await fetch(`${API_BASE_URL}/api/notification/optOut`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.error || 'An error occurred');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while updating your preferences.');
        }
    };

    const handleConfirmOptOut = async () => {
        // Proceed with the update after confirmation
        await updateOptOutPreferences();
        setShowConfirmModal(false);
    };

    return (
        <>
        < Navigation />
        <div className="container">
            <div className="opt-out-container">
                <h2>Opt-out of Notifications</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Check
                        type="checkbox"
                        label="Receive SMS notifications"
                        checked={receivePhone}
                        onChange={(e) => setReceivePhone(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="Receive Email notifications"
                        checked={receiveEmail}
                        onChange={(e) => setReceiveEmail(e.target.checked)}
                    />
                    <Button type="submit" variant="primary">
                        Submit
                    </Button>
                </Form>

                {/* Confirmation Modal */}
                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Opt-out</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            You are about to unsubscribe from all notifications, which means you will no longer receive any
                            updates related to Homeward Bound Pet Rescue volunteering activities. Please confirm if you wish
                            to proceed.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmOptOut}>
                            Confirm Opt-out
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
        </>
    );
};

export default OptOut;