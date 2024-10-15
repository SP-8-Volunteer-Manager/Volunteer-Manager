function AdminEventList() {
    


    return (
        
          
    <section>
        <div className="container">
        <div>
        <div className="d-flex justify-content-between align-items-center m-5">
                <h2>Event Information</h2> 
                <button type="button" className="btn btn-primary">New event</button>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Task</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Location</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
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
                    </tr>
                    
                </tbody>
                </table>

        </div>
        </div>
    </section>
   
        
    );
};


export default AdminEventList;