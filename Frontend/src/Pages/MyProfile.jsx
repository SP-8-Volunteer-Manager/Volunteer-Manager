
import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import API_BASE_URL from '../config';

function MyProfile({userData}) {

  //  console.log(userData)
    const[usermsg, setUserMsg] = useState('');
    const [formValues, setFormValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [profData, setProfData] = useState({});
    const [inputError, setInputError] = useState('');

    const [fnameError, setFnameError] = useState('');
    const [lnameError, setLnameError] = useState('');
    const [phoneError, setPhoneError] = useState('');


    const [isEditMode, setIsEditMode] = useState(false);

    const handleSave = async (e) => {
        //e.preventDefault();


        // if (profData.first_name == "")
        //     {
        //         setInputError('First Name is Required');
        //         return;
        //     }

        const updateData = {
            volunteerData: {
                first_name: profData.first_name,
                last_name: profData.last_name,
                phone: profData.phone,
                volunteerid: profData.volunteerid
                
            }
            // schedulePreferences: editableVolunteer["Schedule Preferences"].map(pref => ({
            //     shift_id: pref.value 
            // })),
            // taskPreferences: editableVolunteer["Task Preferences"].map(pref => ({
            //     task_type_id: pref.value 
            // })),
        };
        console.log("Handle Save")
        console.log(updateData)
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/updateMyProfile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Update result:', result);
                setUserMsg('Volunteer information updated successfully');
            } else {
                console.error('Failed to update profile:', response.statusText);
                setUserMsg('Error updating profile');
            }
        } catch (error) {
            console.error('Error:', error);
            setUserMsg('Error updating profile');
        }
      };
        
      useEffect(() => {
       //console.log("UserData " + userData)
       console.log("UserId " + userData.userId)
        const fetchVolunteer = async () => {
            try{
                const response = await fetch(`${API_BASE_URL}/api/admin/getVolunteer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"userid": userData.userId})
                });
                if (!response.ok) {
                    //console.log(response);
                    setUserMsg('Error retrieving profile information!!')
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched volunteer data:', data);
                var pdata = {"first_name": data.first_name, "last_name": data.last_name, "phone": data.phone, "email": data.User.email, "volunteerid": data.id}
                setProfData(pdata);
             //   console.log(formValues)
                
            } catch (error) {
      
                console.error(`Error: ${error}`);
            }
        };
        fetchVolunteer();
    }, [userData.userId]);

    const toggleEditMode = () => {
        setFormErrors({})
        if (isEditMode) {
            console.log("Prof DAta First Name: " + profData.first_name)
            setInputError('');
            let errfl = 0;
            if (profData.first_name == "")
            {
                setFnameError('First Name is Required' );
                errfl++;
            }

            if (profData.last_name == "")
            {
                setLnameError('Last Name is Required');
                errfl++;
            }

            console.log('phone length')
            console.log(profData.phone.length)

            if (profData.phone.length != 10)
            {
                console.log('phone name empty')
                setPhoneError('Invalid Phone Number');
                errfl++;
            }
            if (errfl > 0)
            {
                setIsEditMode(true);
                return;
            }

            //let tempVal = value.replace(/[^0-9]/g, '');

            handleSave();
        }
        setIsEditMode(!isEditMode);
    };

    //input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Name: " + name + " Value: " + value)
        setProfData({ ...profData, [name]: value });
      };

      const handlePhone = (e) => {
        const { name, value } = e.target;
        let tempVal = value.replace(/[^0-9]/g, '');
        setProfData({ ...profData, [name]: tempVal });
      };

return (
<>
<section>
            <div className="container pb-5">
                <div className="p-5 rounded-5 " style={{backgroundColor: '#f0f6fd'}}>
                    <form>
                        {/* <div className="row gx-5 gy-3 mb-3"> */}
                        <div className="col-md-6">
                            <label htmlFor="inputFirstName" className="form-label">First Name</label>
                            <input type="text"
                                    name="first_name"
                                    value={profData.first_name || ''} 
                                    className="form-control"
                                    //id="inputFirstName" 
                                    onChange={handleChange} 
                                    disabled={!isEditMode}
                                    required
                                    />
                            {fnameError && (
                            <span className="error">{fnameError}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputLastName" className="form-label">Last Name</label>
                            <input type="text"
                                    name="last_name"
                                    value={profData.last_name || ''} 
                                    className="form-control"
                                    id="inputLastName" 
                                    onChange={handleChange} 
                                    disabled={!isEditMode}
                                    required
                                    />
                            {lnameError && (
                            <span className="error">{lnameError}</span>
                            )}
                        </div>
                        
                        
                        
                        <div className="col-md-6">
                            <label htmlFor="inputPhoneNumber" className="form-label">Phone Number</label>
                            <input type="text" 
                            name="phoneNumber" 
                            className="form-control" 
                            id="inputPhoneNumber" 
                            value={profData.phone || ''}
                            disabled={!isEditMode}
                            onChange={handlePhone}
                            />
                            {phoneError && (
                            <span className="error">{phoneError}</span>
                            )}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">Email</label>
                            <input type="email"
                                    name="User.email"
                                    value={profData.email || ''} 
                                    className="form-control"
                                    id="inputEmail" 
                                    //onChange={(e) => setProfData({ ...profData, name: e.target.value })}
                                    disabled 
                                    />
                            {/* {formErrors.email && (
                            <span className="error">{formErrors.email}</span>
                            )} */}
                        </div>
                       <hr className="mt-5"/>

                        <div>
                            
                            <div className="col-12 my-3">
                            <Button 
                            //type="button" 
                            variant="primary" onClick={toggleEditMode}>
                                {isEditMode ? 'Save' : 'Edit'}
                            </Button>
                            </div>
                            <span className="error">{usermsg}</span>
                        </div> 
                    </form>
                </div>
            </div>
            
        </section>
                
        </>
);
}

export default MyProfile;