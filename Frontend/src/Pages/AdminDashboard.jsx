import MyCalendar from "../Components/MyCalendar";
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

function AdminDashboard({userData}) {
    const [UpcomingEvents, setUpEvents] = useState([]);
    const [newVolunteersCount, setNewVolunteersCount] = useState(0);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try{
                
                const response = await fetch(`${API_BASE_URL}/api/admin/upcomingevents`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                setUpEvents(data);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
        const fetchNewVolunteersCount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/new/count`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNewVolunteersCount(data.count);
            } catch (error) {
                console.error(`Error fetching new volunteers count: ${error}`);
            }
        };

        fetchEvents();
        fetchNewVolunteersCount();

    }
    , []);
            


    return (
        
          
    <section>
        <h2>Hello {userData.username} ({userData.role})!</h2>    
        <div className="row flex-lg-row align-items-stretch g-5 py-5 m-2">
            
            <div className="col-lg-6 pt-5 text-center rounded-5" style={{backgroundColor: '#f0f6fd'}}>
                <h2 className="fw-bold text-body-emphasis mb-3">Notifications</h2>
                {newVolunteersCount > 0 ? (
                        <p className="lead">
                            You have {newVolunteersCount} new volunteer(s). 
                            <Link to="/volunteerList" className="btn btn-link">Review their registration!</Link>
                        </p>
                    ) : (
                        <p className="lead">No new volunteers.</p>
                    )}
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
                    <th scope="col" className="col-3">Task/Event</th>
                    <th scope="col" className="col-4">Description</th>
                    <th scope="col" className="col-1 text-nowrap">Date</th>
                    <th scope="col" className="col-1 text-nowrap">Time</th>
                    <th scope="col" className="col-3">Volunteer</th>
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
                            const [hour, minute] = event.start_time.split(':');
                            const date = new Date();
                            date.setHours(hour, minute);
                            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                            // Determine if the volunteer is assigned
                            const volunteerAssigned = event.assignment && event.assignment.length > 0;
                            return(
                            <tr key={event.id} >
                                <td>{event.name}</td>
                                <td>{event.description}</td>
                                <td>{event.start_date}</td>
                                <td>{time}</td>
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