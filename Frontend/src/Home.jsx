import dogImage from './assets/dog.jpg'
import cat from './assets/cat.png'
import React, { useState } from 'react'
import Login from './Components/LogIn'
import { useNavigate } from 'react-router-dom';
import Logo from './assets/HBPR-logo.png'



function Home({ setIsLoggedIn }) {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/signUp');
    }; 

    return (
        
        <>    
            <section className="info mb-5">
                <div className="picture overflow-hidden container-fluid px-3 px-md-5" style={{maxHeight: '75vh'}}>
                    <img src={cat} className="img-fluid shadow-lg mb-3 w-100" alt="cat" loading="lazy"/>
                </div>
                <div className="container px-4 pt-3">
                    <div className="row flex-lg-row-reverse align-items-center g-5 pt-5">
                        <div className="col-12 col-sm-8 col-lg-6">
                            <img src={dogImage} className="d-block mx-lg-auto img-fluid rounded-15 " alt="dog" loading="lazy"/>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Volunteer</h1>
                            <p className="lead" style={{ textAlign: 'left' }}>
                                We are a non-profit pet rescue in the North Georgia mountains, saving dogs and cats, puppies, and kittens. 
                                We rescue animals from local high kill shelters and from abandonment, then we help heal and comfort them and find them forever homes. 
                                In addition, when our resources allow, we offer assistance, in the form of food, collars, 
                                leashes, beds, etc. to our neighboring non-profit organizations to further their mission of helping our broader communities. 
                                Our volunteers are dedicated to our mission, and we welcome any and all donations from our wonderful supporters!<br /><br />

                                Our staff is a dedicated group of volunteers who create a safe, nurturing environment for our homeless animals. 
                                Simply put, without our volunteers, there would be no Homeward Bound. 
                                Our volunteers man the phone lines, work in our thrift store, Paws and Claws, and help loving families find their newest family member at adoptions. 
                                They walk dogs, pet cats, feed and play with them, and of course, clean up after them.
                                Our grounds are well kept up and repairs made due to volunteers who take the time to help us keep things neat. 
                                Some volunteers help us with social media and photography. Some plan fund raisers.

                            </p>
                        </div>
                    </div>
                </div>
                <div className="container my-5" >
                    <div className="pt-5 text-center rounded-5 " style={{backgroundColor: '#f0f6fd'}}>
                        <h2 className="text-body-emphasis">Get Involved</h2>
                        <p className="lead">
                            We have volunteers who only help on weekends when they visit North Georgia and youth volunteers who create posters or wash dishes. 
                            Some only have time to run a few loads of laundry, and that's OK, too. We can use help of all kinds.
                            <br /><br />
                            We need more volunteers who love dogs and cats! Join us! Fill the sign up form below.                    
                        </p>
                        <button className="btn btn-primary px-5 mb-5 rounded-pill" type="button" onClick={handleSignUpClick}>
                            Sign up
                        </button>
                    </div>
                </div>
                <div className="container mt-5" >
                    <div className="pt-5 text-center rounded-5" style={{backgroundColor: '#f0f6fd'}}>
                        <h2 className="text-body-emphasis">Already a volunteer?</h2>
                        <p className="lead">
                            Log in below to schedule your time, and more.                    
                        </p>
                        <button className="btn btn-primary px-5 mb-5 rounded-pill" type="button" onClick={handleShow}>
                            Log in
                        </button>
                    </div>
                </div>
                
            </section>
            
        {/* Modal */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                    <img src={Logo} className="img-fluid w-100 h-100  rounded-top-4 " alt="HBPR-logo" loading="lazy" />
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            
                            <h2 className="fw-bold">Log in</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  onClick={handleClose}></button>
                        
                        </div>
                        <div className="modal-body p-5 pt-0 mb-4">
                             {/* Pass closeModal and setIsLoggedIn to the Login component */}
                            <Login setIsLoggedIn={setIsLoggedIn} closeModal={handleClose}/>
                        </div>
                        
                        
                    </div>
                </div>
                
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
        
        
    );
};


export default Home;