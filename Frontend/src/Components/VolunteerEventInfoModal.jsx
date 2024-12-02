import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from "react";
import API_BASE_URL from '../config';


function VolunteerEventInfoModal({ show, onHide, event, backdrop, keyboard }) {
  
  const [showCancel, setShowCancel] = useState(true);
  const [userMsg, setUserMsg] = useState('');
  const [reloadFlag, setReloadFlag] = useState(false);
  const [isCancelDisabled, setIsCancelDisabled] = useState(false);


  useEffect(() => {
    const eventdate = event?.start?.toLocaleDateString();
    const currDate = new Date().toLocaleDateString();

    if (eventdate < currDate) {
      setShowCancel(false);
    } else {
      setShowCancel(true);
    }
  }, [event]);

  // Update reloadFlag in the cancelEvent function
const cancelEventAvailability = async () => {
  const confirmCancel = window.confirm('Are you sure you want to cancel availability for this event?');
  if (confirmCancel) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/cancelavailability/${event.taskid}/${event.volid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReloadFlag(true); // Update state instead of a local variable
      setUserMsg(data.message);
      setIsCancelDisabled(true)
    } catch (error) {
      console.error('Error canceling event availability:', error);
      setUserMsg('Error Canceling Event Availability');
    }
  }
};

  const handleClose = () => {
    setUserMsg('');
    onHide(reloadFlag); // Pass the state value
    setIsCancelDisabled(false);
    setReloadFlag(false); // Reset the flag after passing it
  };


  function convertMilitaryTo12Hour(time) {
    if (!time) return 'N/A';

    // Split the input time string into hours and minutes
    let [hours, minutes] = time.split(":").map(Number);
  
    // Determine if the time is AM or PM
    const suffix = hours >= 12 ? "PM" : "AM";
  
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // '0' becomes '12' in 12-hour format
  
    // Return formatted time with padded hours, minutes, and seconds
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal-dialog modal-lg"
      backdrop={backdrop}
      keyboard={keyboard}
      style={{ content: { padding: '0', border: 'none', inset: '0' } }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Details For: {event?.title || 'Event Details'}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <p><strong>Date:</strong> {event?.start?.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {convertMilitaryTo12Hour(event?.starttime)}</p>
          <p><strong>Task type:</strong> {event?.task_type || 'No description available.'}</p>
          <p><strong>Description:</strong> {event?.description || 'No description available.'}</p>
          <p><strong>Location:</strong> {event?.location || 'No description available.'}</p>
        </div>
        <div className="modal-footer">
        <div className="mt-3">
            <span className="text-danger">{userMsg}</span>
        </div>
          {showCancel  && (<button type="button" className="btn btn-primary" onClick={cancelEventAvailability}
          disabled={isCancelDisabled}
          >Cancel Availability</button>  )}
          <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
        </div>
        
      </div>
    </Modal>
  );
}

export default VolunteerEventInfoModal;