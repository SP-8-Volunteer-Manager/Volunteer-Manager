import React, {useEffect, useState} from 'react';
import API_BASE_URL from '../config';
import VolunteerCalendar from "../Components/VolunteerCalendar";
import VolunteerEventInfoModal from "../Components/VolunteerEventInfoModal";

function VolunteerDashboard({userData}) {
    const [UpcomingEvents, setUpEvents] = useState([]);
    const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
    const [reloadKey, setReloadKey] = useState(0);

    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/myupcomingevents/${userData.userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
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
                setUpEvents(formattedEvents);
                //console.log("Upcoming Formatted Events", formattedEvents)
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
    
        const fetchUpcomingEventsCount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/upcomingevent/count/${userData.userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUpcomingEventsCount(data.count);
            } catch (error) {
                console.error(`Error fetching upcoming events count: ${error}`);
            }
        };
    
        fetchEvents();
        fetchUpcomingEventsCount();
    }, [userData.userId, reloadKey]); // Depend on reloadKey
            
    const openEventModal = (event) => {
        //console.log("before open event modal", event)
        setSelectedEvent(event); 
        setEventModalOpen(true);
      };
    
      const closeEventModal = (reloadFlag = false) => {
        setEventModalOpen(false);
        setSelectedEvent(null);
      
        if (reloadFlag) {
          setReloadKey((prev) => prev + 1); // Increment reloadKey to trigger a refresh
        }
      };

    return (
        
          
    <section>
        <h2>Welcome {userData.username} ({userData.role})!</h2>    
        <div className="row flex-lg-row align-items-stretch g-5 py-5 m-2">
            
            <div className="col-lg-6 pt-5 text-center rounded-5" style={{backgroundColor: '#f0f6fd'}}>
                <h2 className="fw-bold text-body-emphasis mb-3">Notifications</h2>
                {upcomingEventsCount > 0 ? (
                        <p className="lead">
                            You have {upcomingEventsCount} upcoming event(s). 
                        </p>
                    ) : (
                        <p className="lead">You have no upcoming events.</p>
                    )}
            </div>
            <div className="col-lg-6 px-lg-5">
                <VolunteerCalendar userData={userData} 
                reloadKey={reloadKey}
                setReloadKey={setReloadKey}/>
            </div>
           
        </div>
        <div>
            <h2>Upcoming events for the week</h2>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Task/Event</th>
                    <th scope="col">Description</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Location</th>
                    </tr>
                </thead>
                <tbody>
    {UpcomingEvents.length === 0 ? (
        <tr>
            <td colSpan="5">No upcoming events</td>
        </tr>
    ) : (
        UpcomingEvents.map((event) => {
            //console.log("Event being rendered:", event); 
            const [hour, minute] = event.starttime.split(':');
            const time = new Date();
            time.setHours(hour, minute);
            const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return (
                <tr key={event.taskid} onClick={() => openEventModal(event)} style={{ cursor: 'pointer' }}>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{event.start.toLocaleDateString()}</td>
                    <td>{formattedTime}</td> 
                    <td>{event.location}</td> 
                </tr>
            );
        })
    )}
</tbody>

                </table>

        </div>

    {/* Vol Event Info Modal */}
    <VolunteerEventInfoModal
        event={selectedEvent}
        show={eventModalOpen}
        onHide={closeEventModal}
        //handleClose={closeEventModal}
      />

    </section>
   
        
    );
};


export default VolunteerDashboard;