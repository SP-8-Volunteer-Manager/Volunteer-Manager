import React, {useEffect, useState} from 'react';
import VolunteerInfo from '../Components/VolunteerInfo';

const VolunteerList=() => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null); // Track selected volunteer
    const [showModal, setShowModal] = useState(false); // Track modal visibility

    //Fetch the volunteer data from the backend
    useEffect(() => {
       
        const fetchVolunteers = async () => {
            try{
                const response = await fetch('http://localhost:8080/api/admin/volunteers/details');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched volunteer data:', data);
                setVolunteers(data);
            } catch (error) {
      
                console.error(`Error: ${error}`);
            }
        };
        fetchVolunteers();
    }, []);

    // Open the modal and load selected volunteer data
    const handleViewInfoClick = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowModal(true);
    };
    const handleReviewNewVolunteer = async (volunteer) => {
        handleViewInfoClick(volunteer);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/volunteers/${volunteer.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            setVolunteers((prevVolunteers) =>
                prevVolunteers.filter((v) => v.id !== volunteer.id)
            );
    
        } catch (error) {
            console.error(`Error updating volunteer: ${error}`);
        }
        

    };

    // Close modal and reset selected volunteer
    const handleCloseModal = () => {
        setSelectedVolunteer(null);
        setShowModal(false);
    };

    return (
        
          
    <section>
        
        <div>
            <h2>New application</h2>
            <table className="table"> 
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Phone number</th>
                    <th scope="col">Email</th>
                    <th scope="col">Schedule Preferences</th>
                    <th scope="col">Task Preferences</th>
                    <th scope="col">Review</th>
                    </tr>
                </thead>
                <tbody>
                    {volunteers.filter(volunteer => volunteer.new).length === 0 ? (
                        <tr>
                            <td colSpan="5">No new volunteers found</td>
                        </tr>
                    ) : (
                        volunteers.filter(volunteer => volunteer.new).map((volunteer) => {
                            return (
                                <tr key={volunteer.id}>
                                    <td>{volunteer.first_name} {volunteer.last_name}</td>
                                    <td>{volunteer.phone}</td>
                                    <td>{volunteer.User.email}</td>
                                    <td>
                                        {volunteer.shift_prefer && volunteer.shift_prefer.length > 0 ? (
                                            <ul>
                                                {volunteer.shift_prefer.map((shift, index) => (
                                                    <li key={index}>
                                                        Day: {shift.shift.day || 'N/A'}, Time: {shift.shift.time || 'N/A'}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'No shifts preferred'
                                        )}
                                    </td>
                                    <td> 
                                        {volunteer.task_prefer && volunteer.task_prefer.length > 0 ? (
                                            <ul>
                                                {volunteer.task_prefer.map((task, index) => (
                                                    <li key={index}>
                                                        {task.task_type.type_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'No tasks preferred'
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => handleReviewNewVolunteer(volunteer)}
                                        >
                                            View Info
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
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
                    <th scope="col">Action</th>
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
                            <td>{volunteer.first_name} {volunteer.last_name}</td>
                            <td>{volunteer.phone}</td>
                            <td>{volunteer.User.email}</td>
                            <td>
                                {volunteer.shift_prefer && volunteer.shift_prefer.length > 0 ? (
                                    <ul>
                                        {volunteer.shift_prefer.map((shift, index) => (
                                            <li key={index}>
                                                Day: {shift.shift.day || 'N/A'}, Time: {shift.shift.time || 'N/A'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'No shifts preferred'
                                )}
                            </td>
                            <td> 
                                {volunteer.task_prefer && volunteer.task_prefer.length > 0 ? (
                                    <ul>
                                        {volunteer.task_prefer.map((task, index) => (
                                            <li key={index}>
                                                {task.task_type.type_name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'No tasks preferred'
                                )}
                            </td>
                            <td>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={() => handleViewInfoClick(volunteer)}
                                >
                                    View Info
                                </button>
                            </td>
                        </tr>
                    ))
                )}  
                </tbody>
                </table>

        </div>
        {/* Render the VolunteerModal component */}
        <VolunteerInfo
                volunteer={selectedVolunteer}
                show={showModal}
                handleClose={handleCloseModal}
            />
    </section>
   
        
    );
};


export default VolunteerList;