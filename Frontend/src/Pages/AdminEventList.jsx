import React, {useEffect, useState} from 'react';
//change the function to display the task list
function AdminEventList() {
    const [events, setEvents] = useState([]);

    //Fetch the event data from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const response = await fetch('http://localhost:8080/api/admin/events');
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
    


    return (
        
          
    <section>
        <div className="container">
        <div>
        <div className="d-flex justify-content-between align-items-center m-5">
                <h2>Event Information</h2> 
                <button type="button" className="btn btn-primary">New event</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                
                    <th scope="col">Task Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Task Type</th>
                    <th scope="col">Location</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Display the event list */}
                    {events.length ==0 ? (
                    <tr>
                        <td colSpan="5">No new volunteer founds</td>
                    </tr>
                ) : (
                    events.map((event) => (
                    <tr key={event.id}>
                        <td>{event.name}</td>
                        <td>{event.description}</td>
                        <td>{event.task_type_id}</td>
                        <td>{event.location}</td>
                        <td>{event.start_date}</td>
                        <td>{event.start_time}</td>
                        <td><button type="button" className="btn btn-primary">Edit</button></td>
                        </tr>
                    ))
                )}
                {/*Comment out the empty table rows
                <tr>
                    <th scope="row"></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><button type="button" className="btn btn-primary">Edit</button></td>
                    </tr>
                    <tr>
                    <th scope="row"></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><button type="button" className="btn btn-primary">Edit</button></td>
                    </tr>*/}
                    
                    
                </tbody>
                </table>

        </div>
        </div>
    </section>
   
        
    );
};


export default AdminEventList;