import MyCalendar from "../Components/MyCalendar";


function AdminDashboard() {
    


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
            <h2>Upcoming events</h2>
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

    </section>
   
        
    );
};


export default AdminDashboard;