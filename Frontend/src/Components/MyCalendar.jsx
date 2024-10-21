
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
Modal.setAppElement('#root');

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const events = [
    {
        title: 'Dog Walking',
        start: new Date(2024, 10, 21, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
        end: new Date(2024, 10, 21, 11, 0),
    },
    {
        title: 'Cat Feeding',
        start: new Date(2024, 10, 21, 12, 0),
        end: new Date(2024, 10, 21, 13, 0),
    },
    {
      title: 'Dog Feeding',
      start: new Date(2024, 10, 21, 11, 0), // Year, Month (0-indexed), Day, Hour, Minute
      end: new Date(2024, 10, 21, 12, 0),
  },
    {
        title: 'Cage Cleaning',
        start: new Date(2024, 10, 22, 14, 0),
        end: new Date(2024, 10, 22, 15, 0),
    },
  ];


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
  
  
  return (
    <div>
      <h2>Pick a Date:</h2>
      <Calendar onChange={onChange} value={date} tileContent={tileContent} />
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
              content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '80%',
              },
          }}
        >
        <h2>Events on {selectedDate ? selectedDate.toDateString() : '...'}</h2>
        <BigCalendar
            localizer={localizer}
            events={events} // Show all events
            startAccessor="start"
            endAccessor="end"
            style={{ height: '500px', margin: '20px', overflowY: 'auto' }} // Set a fixed height and allow vertical scrolling
            defaultDate={selectedDate} // Set the selected date as the default date
            views={['month']} // Limit views to month
        />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );

}

export default MyCalendar;