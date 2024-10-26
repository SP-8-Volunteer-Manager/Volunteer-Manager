import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



function EventInfoModal({ show, onHide, event }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal-dialog modal-lg"
      
      style={{ content: { padding: '0', border: 'none', inset: '0' } }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{event?.name || 'Event Details'}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <p><strong>Date/Time:</strong> {event?.start?.toLocaleString()}</p>
          <p><strong>Task type:</strong> {event?.task_type || 'No description available.'}</p>
          <p><strong>Description:</strong> {event?.description || 'No description available.'}</p>
          <p><strong>Location:</strong> {event?.location || 'No description available.'}</p>
          <p><strong>Volunteer:</strong> {event?.volunteer || 'No volunteer assigned'}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

export default EventInfoModal;