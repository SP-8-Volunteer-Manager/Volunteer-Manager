import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import API_BASE_URL from '../config';




function EventInfoModal({ show, onHide, event, backdrop, keyboard }) {

  const [userMsg, setUserMsg] = useState('');
  const [reloadFlag, setReloadFlag] = useState(false);
  const [isCancelDisabled, setIsCancelDisabled] = useState(false);
  
// Update reloadFlag in the cancelEvent function

const cancelEventAdmin = async () => {
  const confirmCancel = true; // Simulate confirmation
  window.confirm('Are you sure you want to cancel this event?');
  if (confirmCancel) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/cancelevent/${event.taskid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReloadFlag(true); // Mark the event list for reloading
      setUserMsg(data.message);
      setIsCancelDisabled(true); // Disable the cancel button
    } catch (error) {
      console.error('Error canceling event:', error);
    }
  }
};


const handleClose = () => {
  setUserMsg('');
  onHide(reloadFlag); // Pass the current value of reloadFlag to the parent
  setIsCancelDisabled(false);
  setReloadFlag(false); // Reset reloadFlag after closing
};
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal modal-lg"
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
          <p><strong>Time:</strong> {event?.starttime}</p>
          <p><strong>Task type:</strong> {event?.task_type || 'No description available.'}</p>
          <p><strong>Description:</strong> {event?.description || 'No description available.'}</p>
          <p><strong>Location:</strong> {event?.location || 'No description available.'}</p>
          <p><strong>Volunteer:</strong> {event?.volunteer || 'No volunteer assigned'}</p>
        </div>
        <div className="modal-footer">
        <div className="mt-3">
            <span className="text-danger">{userMsg}</span>
        </div>
        {//showCancel  
        //&& 
        (<button type="button" className="btn btn-primary" 
          onClick={cancelEventAdmin}
          disabled={isCancelDisabled}
          >Cancel Event</button>  )}
          <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

export default EventInfoModal;