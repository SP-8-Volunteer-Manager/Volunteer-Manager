import React, {useEffect, useState} from 'react';
import EventInfo from '../Components/EventInfo';
import API_BASE_URL from '../config';
import NewEvent from '../Components/NewEvent';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


//display the task list
function AdminEventList() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
    const [showModal, setShowModal] = useState(false); // Track modal visibility
    const [showNewEventModal, setShowNewEventModal] = useState(false); // Track modal visibility
    const [previousScrollPosition, setPreviousScrollPosition] = useState(0); 

    const [nameFilter, setNameFilter] = useState('');
    const [taskFilter, setTaskFilter] = useState('');
    const [locFilter, setLocFilter] = useState('');
    const [volFilter, setVolFilter] = useState('')

    const [currentAllPage, setCurrentAllPage] = useState(1);
    const allEventsPerPage = 20;

    const [showAll, setShowAll] = useState(false);

    const [reloadKey, setReloadKey] = useState(0);
    //Fetch the event data from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try{
                //console.log("Fethcing events", showAll)
                const response = await fetch(`${API_BASE_URL}/api/admin/events/${showAll}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Events length", data.length);
                setEvents(data);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
        fetchEvents();
    }, [reloadKey, showAll]);


    // Filter volunteers based on the filter criteria
    const filterEvents = (eventsList) => {
        if (!nameFilter 
            && !taskFilter 
            && !locFilter 
            && !volFilter
            ) {
            return eventsList;
        }
        return eventsList.filter(ev => {
            const eventName = `${ev.name}`.toLowerCase();
            const matchesName = eventName.includes(nameFilter.toLowerCase());

            const taskName = `${ev.task_type.type_name}`.toLowerCase();
            const matchesTask = taskName.includes(taskFilter.toLowerCase());

            const eventLoc = `${ev.location}`.toLowerCase();
            const matchesLoc = eventLoc.includes(locFilter.toLowerCase());

             // Check if a volunteer is assigned
            const hasVolunteer = ev.assignment && ev.assignment[0] && ev.assignment[0].volunteer;
            const eventVol = hasVolunteer
            ? `${ev.assignment[0].volunteer.first_name} ${ev.assignment[0].volunteer.last_name}`.toLowerCase()
            : 'no volunteer assigned';

        const matchesVol = eventVol.includes(volFilter.toLowerCase());
    
            return matchesName 
            && matchesTask 
            && matchesLoc
            && matchesVol
            ;
        });
    };

    const filteredAllEvents = filterEvents(events);
   
    // Pagination for all volunteers section
    const indexOfLastEvent = currentAllPage * allEventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - allEventsPerPage;
    const currentEvents = filteredAllEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalAllPages = Math.ceil(filteredAllEvents.length / allEventsPerPage);

    // console.log("First Event Index", indexOfFirstEvent)
    // console.log("Last Event Index", indexOfLastEvent)
    // console.log("Current Events", currentEvents)
    // console.log("Total Pages", totalAllPages)
    
    // Open the modal and load selected event data
    const handleViewInfoClick = (event) => {
        setPreviousScrollPosition(window.scrollY); // Save scroll position
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleNewEventClick = () => {
        setShowNewEventModal(true);
    };

    // Close modal and reset selected event
    const handleCloseModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
        window.scrollTo(0, previousScrollPosition); // Scroll to saved position
    };

    const handleNewEventCloseModal = (taskId) => {
        setShowNewEventModal(false);
        //console.log(taskId)
        if (taskId > 0){
            //If new event created then reload page or else do nothing
            setReloadKey((prevKey) => prevKey + 1);
        }
    };

    const handlePageChange = (page) => {
            setCurrentAllPage(page);
    };

    const handleCheckboxChange = (event) => {
        //console.log("Values", event.target.value)
        //console.log("Name", event.target.name)
        const { name, checked } = event.target;
        setShowAll(checked);
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
            {/* Pagination for All Events */}
            
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

                    <div className="form-check">
                        <input className="form-check-input" 
                        title="When Checked Includes One Month Back"
                        type="checkbox" 
                        id="showall"
                        name="showall" 
                        value={showAll} 
                        onChange={handleCheckboxChange}/>
                        <label className="form-check-label" htmlFor="showall"
                        title="When Checked Includes One Month Back"
                        >Show All</label>
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

            
        </div>
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
};


export default AdminEventList;