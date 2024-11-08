import React, {useEffect, useState} from 'react';
import EventInfo from '../Components/EventInfo';
import API_BASE_URL from '../config';
import NewEvent from '../Components/NewEvent';

//display the task list
function AdminEventList() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
    const [showModal, setShowModal] = useState(false); // Track modal visibility
    const [showNewEventModal, setShowNewEventModal] = useState(false); // Track modal visibility
    const [previousScrollPosition, setPreviousScrollPosition] = useState(0); 
    //Fetch the event data from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const response = await fetch(`${API_BASE_URL}/api/admin/events`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setEvents(data);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
        fetchEvents();
    }, []);
    
    // Open the modal and load selected volunteer data
    const handleViewInfoClick = (event) => {
        setPreviousScrollPosition(window.scrollY); // Save scroll position
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleNewEventClick = () => {
        setShowNewEventModal(true);
    };

    // Close modal and reset selected volunteer
    const handleCloseModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
        window.scrollTo(0, previousScrollPosition); // Scroll to saved position
    };

    const handleNewEventCloseModal = () => {
        setShowNewEventModal(false);
    };

    return (
        
          
    <section>
        <div className="container">
        <div>
        <div className="d-flex justify-content-between align-items-center m-5">
                <h2>Event Information</h2> 
                <button type="button" 
                className="btn btn-primary"
                onClick={() => handleNewEventClick()}>New event</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                
                    <th scope="col">Task Name</th>
                    <th scope="col" className="description-column"> Description</th>
                    <th scope="col">Task Type</th>
                    <th scope="col">Location</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Volunteer</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Display the event list */}
                    {events.length ==0 ? (
                    <tr>
                        <td colSpan="5">No new volunteers found</td>
                    </tr>
                    ) : (
                        events.map((event) => {
                            // Determine if the volunteer is assigned
                            const volunteerAssigned = event.assignment && event.assignment.length > 0;
                        return (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td className="description-column">{event.description}</td>
                                <td>{event.task_type.type_name}</td>
                                <td>{event.location}</td>
                                <td>{event.start_date}</td>
                                <td>{event.start_time}</td>
                                <td>
                                        {volunteerAssigned
                                        ? `${event.assignment[0].volunteer.first_name} ${event.assignment[0].volunteer.last_name}`
                                        :   <span style={{ color: 'red', fontWeight: 'bold' }}>
                                            No volunteer assigned
                                            </span>
                                        }
                                    </td>
                                <td>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        onClick={() => handleViewInfoClick(event)}
                                    >
                                        View info
                                    </button>
                                </td>
                            </tr>
                       );
                    })
                    )}
               
                    
                </tbody>
                </table>

        </div>
        </div>
        {/* EventInfo component */}
        <EventInfo
                event={selectedEvent}
                show={showModal}
                handleClose={handleCloseModal}
            />

        <NewEvent
        show={showNewEventModal}
        handleClose={handleNewEventCloseModal}
        />
    </section>
   
        
    );
};


export default AdminEventList;