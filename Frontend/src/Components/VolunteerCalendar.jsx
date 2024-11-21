
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import VolunteerEventInfoModal from './VolunteerEventInfoModal';
import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../config';

const localizer = momentLocalizer(moment);


function VolunteerCalendar({userData, reloadKey, setReloadKey}) {
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);

  //const [reloadKey, setReloadKey] = useState(0);

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/mycalendarevents/${userData.userId}`);
        const data = await response.json();
        
        console.log("Data in frontend", data)

        // Map data to the required format for BigCalendar
        const formattedEvents = data.map(event => {
          const localDate = new Date(event.task.start_date + 'T00:00:00')
          return {
          taskid: event.task.id,
          title: event.task.name,
          start: localDate,
          end: localDate,
          starttime: event.task.start_time,
          task_type: event.task.task_type.type_name || 'N/A',
          description: event.task.description, 
          location: event.task.location,
          volid: event.volunteer_id
        }
      });
        setEvents(formattedEvents);
      //console.log("Events", events)

      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    //console.log({events});
  }, [userData.userId, reloadKey]);

  const onChange = (newDate) => {
      setDate(newDate);
      setSelectedDate(newDate);
      setModalIsOpen(true); // Open the modal when a date is selected
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDate(null); // Clear the selected date when closing
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventStart = event.start;
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
  };
  
  const tileContent = ({ date }) => {
    const eventsForDate = getEventsForDate(date);
    return (
      <div className="event-dot-container">
        {eventsForDate.map((event, index) => (
          <div key={index} className="event-dot" />
        ))}
      </div>
    );
  };
  
  const openEventsModal = (date) => {
    const eventsForDate = getEventsForDate(date);
    setEventsForSelectedDay(eventsForDate);
    setEventsModalOpen(true);
  };

  const closeEventsModal = () => {
    setEventsModalOpen(false);
  };
  
  const openEventModal = (event) => {
    //console.log("Opening Event Modal with Event:", event);
    setSelectedEvent(event);
    //console.log("Open Event Modal event data", event)
    setEventModalOpen(true); // Open event details modal
  };

  const closeEventModal = (reloadFlag) => {
    if (reloadFlag) {
      setReloadKey((prevKey) => prevKey + 1); // Notify parent to reload
      setEventsModalOpen(false);
    }
    setEventModalOpen(false);
    setSelectedEvent(null);
  };

  const dayPropGetter = (date) => {
    const eventsForDate = getEventsForDate(date);
    return {
      className: eventsForDate.length > 2 ? 'has-more-events' : '',
      onClick: () => {
        if (eventsForDate.length > 2) {
          openEventsModal(date);
        }
      },
    };
  };
  const handleDayClick = (date) => {
    const eventsForDate = getEventsForDate(date);
    if (eventsForDate.length > 2) {
      openEventsModal(date);
    }
  };

  return (
    <div>
      <h3>Pick a Date:</h3>
      <Calendar onChange={onChange} value={date} tileContent={tileContent} />
      <Modal
          show={modalIsOpen}
          onHide={closeModal}
         
          className={`modal modal-xl ${eventModalOpen ||  eventsModalOpen ? 'pointer-events-none modal-backdrop fade' : ''}`}
          
          style={{ content: { padding: '0', border: 'none', inset: '0' } }}
        >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Events on {selectedDate ? selectedDate.toDateString() : '...'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={closeModal}>
            </button>
          </div>
          <div className="modal-body">
            <BigCalendar
                localizer={localizer}
                events={events} // Show all events
                startAccessor="start"
                endAccessor="end"
                style={{ height: '500px', margin: '20px'}} 
                defaultDate={selectedDate} // Set the selected date as the default date
                views={['month']} // Limit views to month
                odayPropGetter={dayPropGetter}
                onSelectEvent={openEventModal}
                onNavigate={handleDayClick} 
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>Close</button>
          </div>
        </div>
      </Modal>

      {/* Modal for events of selected day */}
      <Modal
        show={eventsModalOpen}
        onHide={closeEventsModal}
        className={`modal modal-lg ${eventModalOpen ? 'pointer-events-none modal-backdrop fade' : ''}`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Events on {date.toDateString()}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeEventsModal}></button>
          </div>
          <div className="modal-body">
            <ul>
              {eventsForSelectedDay.map((event, index) => (
                <li key={index} style={{ cursor: 'pointer' }} onClick={() => openEventModal(event)}>
                  {event.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeEventsModal}>Close</button>
          </div>
        </div>
      </Modal>

      <VolunteerEventInfoModal
        show={eventModalOpen}
        onHide={closeEventModal}
        event={selectedEvent}
        backdrop="static" // Prevents closing when clicking on the backdrop
        keyboard={false}  // Prevents closing with the Escape key
      />
    </div>
  );

}

export default VolunteerCalendar;