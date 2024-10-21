import React, {useEffect, useState} from 'react';
const VolunteerList=() => {
    const [volunteers, setVolunteers] = useState([]);

    //Fetch the volunteer data from the backend
    useEffect(() => {
        console.log('failed')
        const fetchVolunteers = async () => {
            try{
                const response = await fetch('http://localhost:8080/api/admin/volunteers/details');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setVolunteers(data);
            } catch (error) {
      
                console.error(`Error: ${error}`);
            }
        };
        fetchVolunteers();
    }, []);


    return (
        
          
    <section>
        
        <div>
            <h2>New application</h2>
            {//Change from class to classname
            }
            <table className="table"> 
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Phone number</th>
                    <th scope="col">Email</th>
                    <th scope="col">Schedule Preferences</th>
                    <th scope="col">Task Preferences</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row"></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    </tr>
                    <tr>
                    <th scope="row"></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    </tr>
                </tbody>
                </table>

        </div>

        {/* Volunteer Information section */}
        <div>
            <h2>Volunteer Information</h2>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Phone number</th>
                    <th scope="col">Email</th>
                    <th scope="col">Schedule Preferences</th>
                    <th scope="col">Task Preferences</th>
                    <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                {volunteers.length ==0 ? (
                    <tr>
                        <td colSpan="5">No new volunteer is found</td>
                    </tr>
                ) : (
                    volunteers.map((volunteer) => (
                        <tr key={volunteer.id}>
                            <td>{volunteer.name}</td>
                            <td>{volunteer["Phone number"]}</td>
                            <td>{volunteer.email}</td>
                            <td>{volunteer["Schedule Preferences"].join(', ')}</td>
                            <td>{volunteer["Task Preferences"].join(', ')}</td>
                            <td><button type="button" className="btn btn-primary">Edit</button></td>
                        </tr>
                    ))
                )}  
                </tbody>
                </table>

        </div>

    </section>
   
        
    );
};


export default VolunteerList;