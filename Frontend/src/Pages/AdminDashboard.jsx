import MyCalendar from "../Components/MyCalendar";
import React, {useEffect, useState} from 'react';

function AdminDashboard() {
    const [UpcomingEvents, setUpEvents] = useState([]);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const response = await fetch('http://localhost:8080/api/admin/upcomingevents');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setUpEvents(data);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
        fetchEvents();
        console.log(UpcomingEvents);
    }
    , []); // empty dependency array to run only once
            


    return (
        
          
    <section>
        <h1>Hello Jack!</h1>    
        <div className="row flex-lg-row align-items-stretch g-5 py-5 m-2">
            
            <div className="col-lg-6 pt-5 text-center rounded-5" style={{backgroundColor: '#f0f6fd'}}>
                <h2 className="fw-bold text-body-emphasis mb-3">Notifications</h2>
                <p className="lead">There are 2 new volunteers. View their registration!</p>
            </div>
            <div className="col-lg-6 px-lg-5">
                <MyCalendar />
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
                    <th scope="col">Volunteer</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {/* Display the event list */}
                    {UpcomingEvents.length ==0 ? (
                        <tr>
                            <td colSpan="5">No upcoming events</td>
                        </tr>
                    ) : (
                        UpcomingEvents.map((event) => {
                            // Determine if the volunteer is assigned
                            const volunteerAssigned = event.assignment && event.assignment.length > 0;
                            return(
                            <tr key={event.id} >
                                <td>{event.name}</td>
                                <td>{event.description}</td>
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
                            </tr>
                        );
                    })
                )}
                    
                    
                </tbody>
                </table>

        </div>

    </section>
   
        
    );
};


export default AdminDashboard;