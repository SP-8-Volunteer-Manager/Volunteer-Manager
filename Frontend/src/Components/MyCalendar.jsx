
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import EventInfoModal from './EventInfoModal';
import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../config';

const localizer = momentLocalizer(moment);


function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/events`);
        const data = await response.json();
        
        // Map data to the required format for BigCalendar
        const formattedEvents = data.map(event => ({
          title: event.name,
          start: new Date(event.start_date),
          end: new Date(event.start_date),
          task_type: event.task_type?.type_name || 'N/A',
          description: event.description, 
          location: event.location,
          volunteer: event.assignment && event.assignment.length > 0 
                    ? `${event.assignment[0].volunteer.first_name} ${event.assignment[0].volunteer.last_name}`
                    : 'No volunteer assigned', // Handle no assignment
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    console.log({events});
  }, []);

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
    setSelectedEvent(event);
    setEventModalOpen(true); // Open event details modal
  };

  const closeEventModal = () => {
    setEventModalOpen(false);
    setSelectedEvent(null); // Clear the selected event
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
      <h2>Pick a Date:</h2>
      <Calendar onChange={onChange} value={date} tileContent={tileContent} />
      <Modal
          show={modalIsOpen}
          onHide={closeModal}
         
          className="modal-dialog modal-xl"
          
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
        className="modal-dialog modal-lg"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Events on {date.toDateString()}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeEventsModal}></button>
          </div>
          <div className="modal-body">
            <ul>
              {eventsForSelectedDay.map((event, index) => (
                <li key={index} onClick={() => openEventModal(event)}>
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

      <EventInfoModal
        show={eventModalOpen}
        onHide={closeEventModal}
        event={selectedEvent}
      />
    </div>
  );

}

export default MyCalendar;