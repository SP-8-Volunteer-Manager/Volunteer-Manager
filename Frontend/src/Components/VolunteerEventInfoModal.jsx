import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



function VolunteerEventInfoModal({ show, onHide, event }) {
  
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
          <p><strong>Time:</strong> {event?.starttime}</p>
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