import React, { useEffect, useState } from 'react';
import EventInfo from '../Components/EventInfo';
import API_BASE_URL from '../config';
import NewEvent from '../Components/NewEvent';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminEventList() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showNewEventModal, setShowNewEventModal] = useState(false);
    const [previousScrollPosition, setPreviousScrollPosition] = useState(0); 

    const [nameFilter, setNameFilter] = useState('');
    const [taskFilter, setTaskFilter] = useState('');
    const [locFilter, setLocFilter] = useState('');
    const [volFilter, setVolFilter] = useState('');

    const [startDateFilter, setStartDateFilter] = useState(''); // Start date filter
    const [endDateFilter, setEndDateFilter] = useState('');     // End date filter

    const [currentAllPage, setCurrentAllPage] = useState(1);
    const allEventsPerPage = 20;

    const [showAll, setShowAll] = useState(false); // Show all events including past month
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/events/${showAll}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
        fetchEvents();
    }, [reloadKey, showAll]);  // fetch events on reload or when showAll changes

    const filterEvents = (eventsList) => {
        return eventsList.filter(ev => {
            const eventName = `${ev.name}`.toLowerCase();
            const taskName = `${ev.task_type.type_name}`.toLowerCase();
            const eventLoc = `${ev.location}`.toLowerCase();
            const hasVolunteer = ev.assignment && ev.assignment[0] && ev.assignment[0].volunteer;
            const eventVol = hasVolunteer
                ? `${ev.assignment[0].volunteer.first_name} ${ev.assignment[0].volunteer.last_name}`.toLowerCase()
                : 'no volunteer assigned';

            // Convert start_date to a Date object for comparison
            const eventDate = new Date(ev.start_date);
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;

            // Check if event date is within the specified date range
            const isWithinDateRange = (!startDate || eventDate >= startDate) && (!endDate || eventDate <= endDate);

            return (
                eventName.includes(nameFilter.toLowerCase()) &&
                taskName.includes(taskFilter.toLowerCase()) &&
                eventLoc.includes(locFilter.toLowerCase()) &&
                eventVol.includes(volFilter.toLowerCase()) &&
                isWithinDateRange
            );
        });
    };

    const filteredAllEvents = filterEvents(events);

    const indexOfLastEvent = currentAllPage * allEventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - allEventsPerPage;
    const currentEvents = filteredAllEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalAllPages = Math.ceil(filteredAllEvents.length / allEventsPerPage);

    const handleViewInfoClick = (event) => {
        setPreviousScrollPosition(window.scrollY);
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleNewEventClick = () => {
        setShowNewEventModal(true);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
        window.scrollTo(0, previousScrollPosition);
    };

    const handleNewEventCloseModal = (taskId) => {
        setShowNewEventModal(false);
        if (taskId > 0) {
            setReloadKey(prevKey => prevKey + 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentAllPage(page);
    };

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setShowAll(checked);
    };

    return (
        <section>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center m-5">
                    <h2>Event Information</h2> 
                    <button type="button" className="btn btn-primary" onClick={handleNewEventClick}>New event</button>
                </div>

                <div className="row mb-4">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Name"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Task Type"
                            value={taskFilter}
                            onChange={(e) => setTaskFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Location"
                            value={locFilter}
                            onChange={(e) => setLocFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Volunteer"
                            value={volFilter}
                            onChange={(e) => setVolFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            title="Pick Start Date"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            title="Pick End Date"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="showall"
                                title="Include past events (up to 1 month)"
                                checked={showAll} 
                                onChange={handleCheckboxChange} 
                            />
                            <label className="form-check-label" htmlFor="showall">
                            Include Past Events
                            </label>
                        </div>
                    </div>
                </div>
            <table className="table">
                <thead>
                    <tr>
                
                    <th scope="col" className="col-2">Task Name</th>
                    <th scope="col" className="col-2"> Description</th>
                    <th scope="col" className="col-1">Task Type</th>
                    <th scope="col" className="col-2">Location</th>
                    <th scope="col" className="col-1 text-nowrap">Date</th>
                    <th scope="col" className="col-1 text-nowrap">Time</th>
                    <th scope="col" className="col-2">Volunteer</th>
                    <th scope="col" className="col-1 text-nowrap">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Display the event list */}
                    {currentEvents.length ==0 ? (
                    <tr>
                        <td colSpan="5">No events found</td>
                    </tr>
                    ) : (
                        currentEvents.map((event) => {
                            const [hour, minute] = event.start_time.split(':');
                            const date = new Date();
                            date.setHours(hour, minute);
                            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                            // Determine if the volunteer is assigned
                            const volunteerAssigned = event.assignment && event.assignment.length > 0;
                   
                        return (
                            <tr key={event.id}>
                                <td className="col-2">{event.name}</td>
                                <td className="col-2">{event.description}</td>
                                <td className="col-1">{event.task_type.type_name}</td>
                                <td className="col-2">{event.location}</td>
                                <td className="col-1 text-nowrap">{event.start_date}</td>
                                <td className="col-1 text-nowrap">{formattedTime}</td>
                                <td className="col-2">
                                        {volunteerAssigned
                                        ? `${event.assignment[0].volunteer.first_name} ${event.assignment[0].volunteer.last_name}`
                                        :   <span style={{ color: 'red', fontWeight: 'bold' }}>
                                            No volunteer assigned
                                            </span>
                                        }
                                    </td>
                                <td className="col-1 text-nowrap">
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

            
        
        <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentAllPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentAllPage - 1)} disabled={currentAllPage === 1} />
                {[...Array(totalAllPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentAllPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentAllPage + 1)} disabled={currentAllPage === totalAllPages} />
                <Pagination.Last onClick={() => handlePageChange(totalAllPages)} disabled={currentAllPage === totalAllPages} />
            </Pagination>
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
}

export default AdminEventList;
