import React, {useEffect, useState} from 'react';
import VolunteerInfo from '../Components/VolunteerInfo';
import { Pagination } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import NotificationModal from '../Components/NotificationModal';
import API_BASE_URL from '../config';

const VolunteerList=() => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null); // Track selected volunteer
    const [showModal, setShowModal] = useState(false); // Track modal visibility
    const [nameFilter, setNameFilter] = useState('');
    const [taskFilter, setTaskFilter] = useState('');
    const [shiftDayFilter, setShiftDayFilter] = useState('');
    const [shiftTimeFilter, setShiftTimeFilter] = useState('');
    const [previousScrollPosition, setPreviousScrollPosition] = useState(0); 
    const [currentNewPage, setCurrentNewPage] = useState(1);
    const [currentAllPage, setCurrentAllPage] = useState(1);
    const newVolunteersPerPage = 5;
    const allVolunteersPerPage = 10;
    const [showNotificationModal, setShowNotificationModal] = useState(false);

   // const handleSendNotification = (message) => {
     //   console.log("Sending notification:", message);
        
       
    //};
    const handleModalClose = () => {
        handleClose(); 
        setShowNotificationModal(false); 
    };
    //Fetch the volunteer data from the backend
    useEffect(() => {
       
        const fetchVolunteers = async () => {
            try{
                const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/details`);
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
    
    // Pagination for new applications section
    const newVolunteers = volunteers.filter(volunteer => volunteer.new);
    const indexOfLastNewVolunteer = currentNewPage * newVolunteersPerPage;
    const indexOfFirstNewVolunteer = indexOfLastNewVolunteer - newVolunteersPerPage;
    const currentNewVolunteers = newVolunteers.slice(indexOfFirstNewVolunteer, indexOfLastNewVolunteer);
    const totalNewPages = Math.ceil(newVolunteers.length / newVolunteersPerPage);

    // Filter volunteers based on the filter criteria
    const filterVolunteers = (volunteersList) => {
        if (!nameFilter && !taskFilter && !shiftDayFilter && !shiftTimeFilter) {
            return volunteersList;
        }
        return volunteersList.filter(volunteer => {
            const fullName = `${volunteer.first_name} ${volunteer.last_name}`.toLowerCase();
            const matchesName = fullName.includes(nameFilter.toLowerCase());
            const matchesTask = volunteer.task_prefer.some(task =>
                task.task_type.type_name.toLowerCase().includes(taskFilter.toLowerCase())
            );
            const matchesShift = volunteer.shift_prefer && volunteer.shift_prefer.some(shift => 
                shift.shift.day.toLowerCase().includes(shiftDayFilter.toLowerCase()) && 
                shift.shift.time.toLowerCase().includes(shiftTimeFilter.toLowerCase())
            );
    
            return matchesName && matchesTask && (shiftDayFilter === '' && shiftTimeFilter === '' || matchesShift);
        });
    };
    // Pagination for all volunteers section

    const sortedVolunteers = volunteers.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    const filteredAllVolunteers = filterVolunteers(sortedVolunteers);
   

    const indexOfLastAllVolunteer = currentAllPage * allVolunteersPerPage;
    const indexOfFirstAllVolunteer = indexOfLastAllVolunteer - allVolunteersPerPage;
    const currentAllVolunteers = filteredAllVolunteers.slice(indexOfFirstAllVolunteer, indexOfLastAllVolunteer);
    const totalAllPages = Math.ceil(filteredAllVolunteers.length / allVolunteersPerPage);



    
    const handlePageChange = (page, type) => {
        if (type === "new") {
            setCurrentNewPage(page);
        } else {
            setCurrentAllPage(page);
        }
    };

    // Open the modal and load selected volunteer data
    const handleViewInfoClick = (volunteer) => {
        setPreviousScrollPosition(window.scrollY); // Save scroll position
        setSelectedVolunteer(volunteer);
        setShowModal(true);
    };
    const handleReviewNewVolunteer = async (volunteer) => {
        handleViewInfoClick(volunteer);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/${volunteer.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            setVolunteers((prevVolunteers) =>
                prevVolunteers.map((v) =>
                    v.id === volunteer.id ? { ...v, new: false } : v
                )
            );
    
        } catch (error) {
            console.error(`Error updating volunteer: ${error}`);
        }
        

    };

    // Close modal and reset selected volunteer
    const handleCloseModal = async () => {
        if (selectedVolunteer) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/${selectedVolunteer.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedVolunteer),  // Send updated volunteer data
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const updatedVolunteer = await response.json();
    
                // Update the volunteers state to reflect the updated volunteer
                setVolunteers((prevVolunteers) =>
                    prevVolunteers.map((v) =>
                        v.id === updatedVolunteer.id ? updatedVolunteer : v // Replace with the updated volunteer
                    )
                );
    
            } catch (error) {
                console.error(`Error updating volunteer: ${error}`);
            }
        }
        setSelectedVolunteer(null);
        setShowModal(false);
        window.scrollTo(0, previousScrollPosition); // Scroll to saved position
    };

    return (
        
          
    <section>
        {/*New applications*/}
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
                    {currentNewVolunteers.length === 0 ? (
                        <tr>
                            <td colSpan="5">No new volunteers found</td>
                        </tr>
                    ) : (
                        currentNewVolunteers.map((volunteer) => {
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

            {/* Pagination for New Applications */}
            <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1, "new")} disabled={currentNewPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentNewPage - 1, "new")} disabled={currentNewPage === 1} />
                    {[...Array(totalNewPages).keys()].map((page) => (
                        <Pagination.Item
                            key={page + 1}
                            active={page + 1 === currentNewPage}
                            onClick={() => handlePageChange(page + 1, "new")}
                        >
                            {page + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentNewPage + 1, "new")} disabled={currentNewPage === totalNewPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalNewPages, "new")} disabled={currentNewPage === totalNewPages} />
                </Pagination>
        </div>

        {/* All Volunteers Information section */}
        <div className="container mt-4">
            <h2>Volunteer Information</h2>
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
                            placeholder="Filter by Task Preferences"
                            value={taskFilter}
                            onChange={(e) => setTaskFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Shift Day"
                            value={shiftDayFilter}
                            onChange={(e) => setShiftDayFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by Shift Time"
                            value={shiftTimeFilter}
                            onChange={(e) => setShiftTimeFilter(e.target.value)}
                        />
                    </div>
                </div>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col" className="col-2">Name</th>
                    <th scope="col" className="col-1 text-nowrap">Phone number</th>
                    <th scope="col" className="col-1 text-nowrap">Email</th>
                    <th scope="col" className="col-2">Schedule Preferences</th>
                    <th scope="col" className="col-2">Task Preferences</th>
                    <th scope="col" className="col-1 text-nowrap">Action</th>
                    </tr>
                </thead>
                <tbody>
                {currentAllVolunteers.length === 0 ? (
                    <tr>
                        <td colSpan="5">No new volunteer is found</td>
                    </tr>
                ) : (
                    currentAllVolunteers.map((volunteer) => (
                            <tr key={volunteer.id}>
                            <td>{volunteer.first_name} {volunteer.last_name}</td>
                            <td className="text-nowrap">{volunteer.phone}</td>
                            <td className="text-nowrap">{volunteer.User.email}</td>
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
                            <td className="text-nowrap">
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
            
             {/* Pagination for All Volunteers */}
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1, "all")} disabled={currentAllPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentAllPage - 1, "all")} disabled={currentAllPage === 1} />
                {[...Array(totalAllPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentAllPage}
                        onClick={() => handlePageChange(page + 1, "all")}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentAllPage + 1, "all")} disabled={currentAllPage === totalAllPages} />
                <Pagination.Last onClick={() => handlePageChange(totalAllPages, "all")} disabled={currentAllPage === totalAllPages} />
            </Pagination>
      
        </div>
        {/* VolunteerInfo component */}
        <VolunteerInfo
            volunteer={selectedVolunteer}
            show={showModal}
            handleClose={handleCloseModal}
        />

        {/* Notification Modal */}
        
        <NotificationModal 
            show={showNotificationModal}
            handleClose={() => setShowNotificationModal(false)}
          //  handleSend={handleSendNotification}
            volunteers={filteredAllVolunteers}
        />
       
       <Button 
                onClick={() => setShowNotificationModal(true)} 
                >
                    Send Notification
        </Button>


    </section>
   
        
    );
};


export default VolunteerList;