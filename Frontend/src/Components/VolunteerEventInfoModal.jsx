import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



function VolunteerEventInfoModal({ show, onHide, event }) {
  

  function convertMilitaryTo12Hour(time) {
    if (!time) return 'N/A';

    // Split the input time string into hours, minutes, and seconds
    let [hours, minutes, seconds] = time.split(":").map(Number);
  
    // Determine if the time is AM or PM
    const suffix = hours >= 12 ? "PM" : "AM";
  
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // '0' becomes '12' in 12-hour format
  
    // Return formatted time with padded hours, minutes, and seconds
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

  //console.log(event?.starttime)
  //console.log(typeof event?.starttime)

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal-dialog modal-lg"
      
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
          <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

export default VolunteerEventInfoModal;