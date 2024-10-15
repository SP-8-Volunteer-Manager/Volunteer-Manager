

function ContactUs() {
    return (
        <div className="container col-xl-10 col-xxl-8 px-3 mb-3">
            <div className="row align-items-center g-lg-5 py-0">
                <div className="col-lg-6 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Contact us</h1>
                    <p className="col-lg-10 fs-4">Please use this form to contact us. We will get back to you as soon as we can.</p>
                </div>
                <div className="col-md-10 mx-auto col-lg-6">
                    <form className="p-3 border px-md-5 py-md-4 rounded-5"style={{backgroundColor: '#f0f6fd'}}> 
                        <div > 
                            <div className="mb-3">
                                <label htmlFor="inputName" className="form-label">Name*</label>
                                
                                <input type="text" className="form-control" id="inputName" />
                                
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputEmail" className="form-label">Email*</label>
                                
                                    <input type="email" className="form-control" id="inputEmail" placeholder="example@domain.com"/>
                                
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputPhone" className="form-label">Phone Number</label>
                                
                                <input type="text" className="form-control" id="inputPhone" />
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputMessage" className="form-label">Message*</label>
                                
                                <textarea className="form-control" id="inputMessage" rows="3"/>
                             
                            </div>
                                <button type="submit" className="btn btn-primary ">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    
    );
};


export default ContactUs;
