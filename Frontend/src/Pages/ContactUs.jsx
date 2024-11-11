import React, { useState } from 'react';
import API_BASE_URL from '../config';

function ContactUs() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { id, value } = e.target;

        switch (id) {
            case 'inputName':
                setName(value);
                break;
            case 'inputEmail':
                setEmail(value);
                break;
            case 'inputPhone':
                setPhone(value);
                break;
            case 'inputMessage':
                setMessage(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous errors
        setErrors({});

        // Validate required fields
        const validationErrors = {};
        if (!name) validationErrors.name = 'Name is required.';
        if (!email) validationErrors.email = 'Email is required.';
        if (!message) validationErrors.message = 'Message is required.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Proceed with form submission (send the form data to an API)
        const formData = {
            name,
            email,
            phone,
            message,
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify(formData), // Convert formData to JSON string, 
            });
    
            if (!response.ok) {
                throw new Error('Network error');
            }
    
            const responseData = await response.json();
            console.log('Message sent successfully:', responseData);
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('There was an error sending the message.');
        }
        

        // Clear form after submission
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
    };

    return (
        <div className="container col-xl-10 col-xxl-8 px-3 mb-3 form-section">
            <div className="row align-items-center g-lg-5 py-0">
                <div className="col-lg-6 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Contact us</h1>
                    <p className="col-lg-10 fs-4">Please use this form to contact us. We will get back to you as soon as we can.</p>
                </div>
                <div className="col-md-10 mx-auto col-lg-6">
                    <form className="p-3 border px-md-5 py-md-4 rounded-5"style={{backgroundColor: '#f0f6fd'}} onSubmit={handleSubmit}> 
                        <div > 
                            <div className="mb-3">
                                <label htmlFor="inputName" className="form-label">Name*</label>
                                
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                    id="inputName" 
                                    value={name}
                                    onChange={handleChange}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputEmail" className="form-label">Email*</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="inputEmail"
                                    placeholder="example@domain.com"
                                    value={email}
                                    onChange={handleChange}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputPhone" className="form-label">Phone Number</label>
                                
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputPhone"
                                    value={phone}
                                    onChange={handleChange}
                                />
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputMessage" className="form-label">Message*</label>
                                
                                <textarea
                                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                    id="inputMessage"
                                    rows="3"
                                    value={message}
                                    onChange={handleChange}
                                />
                                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                             
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
