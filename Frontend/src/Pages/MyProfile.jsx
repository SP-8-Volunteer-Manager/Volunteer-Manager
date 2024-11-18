import React, { useState, useEffect } from "react";
import StateDropdown from '../Components/StateDropdown';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import API_BASE_URL from '../config';
import { useNavigate } from "react-router-dom";


function MyProfile({userData}) {

    const navigate = useNavigate();
    const[usermsg, setUserMsg] = useState('');
    const [scheduleOptions, setScheduleOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);
    const [initVal, setInitVal] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phoneNumber: '',  // Ensure this is initialized in formValues
        email: '',
        receiveemail: false,
        receivesms: false,
        schedPref: [],
        taskPref: []
      });
    const [formErrors, setFormErrors] = useState({});

    // Handle changes to multiple select dropdowns
    const handleMultiSelectChange = (selectedOptions, field) => {
        setFormValues(prev => ({
            ...prev,
            [field]: selectedOptions || []
        }));
    };

    // Fetch options for schedule and task preferences
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const scheduleResponse = await fetch(`${API_BASE_URL}/api/admin/scheduleOptions`);
                if (!scheduleResponse.ok) {
                    throw new Error(`Failed to fetch schedule options, status: ${scheduleResponse.status}`);
                }
                const scheduleData = await scheduleResponse.json();
                //console.log('schedule data', scheduleData);
                var schedTemp = scheduleData.map(option => ({
                    key: option.id,
                    value: option.id,
                    label: `${option.day} ${option.time}`
                }))
                //console.log("Sched Temp", schedTemp)
                setScheduleOptions(schedTemp);
                //console.log("After fetch shift", scheduleOptions)
                const taskResponse = await fetch(`${API_BASE_URL}/api/admin/taskOptions`);
                if (!taskResponse.ok) {
                    throw new Error(`Failed to fetch task options, status: ${taskResponse.status}`);
                }
                const taskData = await taskResponse.json();
                var taskTemp = taskData.map(option => ({
                    key: option.id,
                    value: option.id,
                    label: option.type_name
                }))
                setTaskOptions(taskTemp);
                //console.log("Task Temp", taskTemp)
                //console.log("After fetch task", taskOptions)
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        //console.log("UserData " + userData)
        //console.log("UserId " + userData.userId)
         const fetchVolunteer = async () => {
             try{
                 const response = await fetch(`${API_BASE_URL}/api/admin/getMyProfile`, {
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
                 //console.log('Fetched volunteer data:', data);
                 populateProfileData(data);
                 setInitVal(data);
              //   console.log(formValues)
                 
             } catch (error) {
       
                 console.error(`Error: ${error}`);
             }
         };
         fetchVolunteer();
     }, [userData.userId]);

     function populateProfileData(data) {
        setFormValues({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip_code || '',
            phoneNumber: data.phone || '',
            useremail: data.User?.email || '',  // Ensure fallback
            receiveemail: data.receive_email || false,
            receivesms: data.receive_phone || false,
            volunteerid: data.id || '',
            schedPref: data.shift_prefer 
                ? data.shift_prefer.map(shift => ({
                      value: shift.shift.id,
                      label: `${shift.shift.day} ${shift.shift.time}`
                  }))
                : [], // Fallback to empty array
            taskPref: data.task_prefer 
                ? data.task_prefer.map(task => ({
                      value: task.task_type.id,
                      label: task.task_type.type_name
                  }))
                : [] // Fallback to empty array
        });
    }
    
      //input change handler
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
      };

      const handleCancel = () => {
        //console.log("Handle Cancel InitVal", initVal)
        populateProfileData(initVal);
        //setFormValues(initVal);
        setIsEditMode(false);

    }

    const toggleEditMode = () => {
        if (isEditMode) {
            //console.log("Form Values b4 validate", formValues)
            const er = validate(formValues)
            setFormErrors(er);
            //console.log("Form Errors", er)
            //console.log("Errors length", Object.keys(er).length)
            var errCnt = Object.keys(er).length;
            //console.log(!formErrors)
            if (errCnt == 0)
            {
                handleSave();
                setIsEditMode(!isEditMode);
            }
        }
        else 
            setIsEditMode(!isEditMode);
    };

      const handlePhone = (e) => {
        const { name, value } = e.target;
        let tempVal = value.replace(/[^0-9]/g, '');
        setFormValues({ ...formValues, [name]: tempVal });
      };

      const dropdownChange = (e) => {
        //console.log("Handle Change");
        const { name, value } = e.target;
        //console.log(name + " " +  value);
        setFormValues({ ...formValues, [name]: value });
      };

      const checkboxChange = (e) => {
        const { name, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: checked,
            ...(name === 'receivesms' && !checked ? { smsoptin: false } : {}),
            ...(name === 'receiveemail' && !checked ? { emailoptin: false } : {}),
        });
    };
    
      //form validation handler
      const validate = (values) => {
        let errors = {};
        setUserMsg('');
        //console.log("In validate")
    
        // console.log("--formvalues");
        // console.log(formValues);
        
         if (values.firstName == "") {
            errors.firstName = "First Name is required";
          }

          if (!values.lastName) {
            errors.lastName = "Last Name is required";
          }


        //   console.log(values.phoneNumber.length);
        //   console.log(values.phoneNumber);
        //console.log("ReceiveSMS: " + values.receivesms)
          if(values.phoneNumber) // phone exists
          {
            if(values.phoneNumber.length != 10)
            {
                errors.phoneNumber = "Must be exactly 10 digits"
            }
          }  // no phone number
          else if (values.receivesms === true)
            {
                errors.phoneNumber = "Phone number required for sms notifications";
            }

        

        
        if (values.receiveemail === false && values.receivesms === false)
        {
            errors.receiveemail = "Select at least one ";
        }

        // if (values.receivesms === true && values.smsoptin === false)
        // {
        //     errors.smsoptin = "SMS Opt-in required";
        // }

        // if (values.receiveemail === true && values.emailoptin === false)
        // {
        //     errors.emailoptin = "Email Opt-in required";
        // }

        if(values.receivesms === false && values.receiveemail === false)
        {
            errors.receiveemail = "Choose at least one communication method";
            errors.receivesms = "Choose at least one communication method";
        }

        if (values.schedPref.length == 0)
        {
            errors.schedPref = "Shift preference is required";
        }

        if (values.taskPref.length == 0)
        {
            errors.taskPref = "Task preference is required";
        }

        //zip must be numeric and 5
        if (values.zip)
        {
            if(values.zip.length != 5)
            {
                errors.zip = "Zip code must be 5 digits";
            }
        }
        if (Object.keys(errors).length != 0) 
        {
            setUserMsg("Please adjust required fields"); 
        }

        return errors;
      };

       const handleSave = async (e) => {
        //e.preventDefault();
        populateProfileData(formValues);
        const updateData = {
            volunteerData: {
                firstName:formValues.firstName,
                lastName:formValues.lastName,
                address:formValues.address,
                city:formValues.city,
                state:formValues.state,
                zip:formValues.zip,
                volunteerid: formValues.volunteerid,
                phoneNumber:formValues.phoneNumber,
                receivesms:formValues.receivesms,
                receiveemail:formValues.receiveemail                
            },
            schedulePreferences: formValues["schedPref"].map(pref => ({
                shift_id: pref.value 
            })),
            taskPreferences: formValues["taskPref"].map(pref => ({
                task_type_id: pref.value 
            })),
        };



        //console.log("Saving Profile")
        //console.log(updateData)
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/updateMyProfile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const result = await response.json();
                //console.log('Update result:', result);
                setUserMsg('Profile information updated successfully');
                navigate('/');

            } else {
                console.error('Failed to update profile:', response.statusText);
                setUserMsg('Error updating profile');
            }
        } catch (error) {
            console.error('Error:', error);
            setUserMsg('Error updating profile');
        }
      };

    

    return (

                 
        <section>
            <div className="container pb-5">
                <div>
                <h2 className="display-5 fw-bold lh-1 text-body-emphasis mb-3">Profile Data For: {userData.username}</h2>
                <p className="col-lg-10 fs-4">Please edit your information using this page.</p>
                </div>
                <div className="p-5 rounded-5 " style={{backgroundColor: '#f0f6fd'}}>
                    <form noValidate>
                        <div className="row gx-5 gy-3 mb-3">
                        <div className="col-md-6">
                            <label htmlFor="inputFirstName" className="form-label">First Name</label>
                            <input type="text"
                                    name="firstName"
                                    value={formValues.firstName} 
                                    className="form-control"
                                    id="inputFirstName" 
                                    onChange={handleChange} 
                                    disabled={!isEditMode}
                                    required/>
                            {formErrors.firstName && (
                            <span className="text-danger">{formErrors.firstName}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputLastName" className="form-label">Last Name</label>
                            <input type="text"
                                    name="lastName"
                                    value={formValues.lastName} 
                                    className="form-control"
                                    id="inputLastName" 
                                    onChange={handleChange} 
                                    disabled={!isEditMode}
                                    required/>
                            {formErrors.lastName && (
                            <span className="text-danger">{formErrors.lastName}</span>
                            )}
                        </div>
                        
                        <div className="col-12">
                            <label htmlFor="inputAddress" className="form-label">Address</label>
                            <input type="text"
                                    name="address"
                                    value={formValues.address} 
                                    className="form-control"
                                    id="inputAddress" 
                                    disabled={!isEditMode}
                                    onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputCity" className="form-label">City</label>
                            <input type="text" name="city" 
                            className="form-control" 
                            id="inputCity"
                            value={formValues.city} 
                            disabled={!isEditMode}
                            onChange={handleChange}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputState" className="form-label">State</label>
                            <StateDropdown dropdownChange={dropdownChange} isEditMode={isEditMode} stateValue={formValues.state}/>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="inputZip" className="form-label">Zip</label>
                            <input type="text" name="zip" className="form-control" id="inputZip"
                                value={formValues.zip} 
                                disabled={!isEditMode}
                                onChange={handleChange}/>
                            {formErrors.zip && (
                            <span className="text-danger">{formErrors.zip}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPhoneNumber" className="form-label">Phone Number</label>
                            <input type="tel" name="phoneNumber" className="form-control" id="inputPhoneNumber"     
                            disabled={!isEditMode} 
                            onChange={handlePhone}
                            value={formValues.phoneNumber} 
                            />
                            {formErrors.phoneNumber && (
                            <span className="text-danger">{formErrors.phoneNumber}</span>
                            )}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">Email</label>
                            <input type="email"
                                    name="useremail"
                                    value={formValues.useremail} 
                                    className="form-control"
                                    id="inputEmail" 
                                    //onChange={handleChange} 
                                    disabled/>
                        </div>

                        <hr className="mt-5"/>

                         <div className="col-md-12 mb-4">
                            
                            <p className="fw-bold mb-1"> Preferred communication method</p>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkSMS"
                                name="receivesms" 
                                checked={formValues.receivesms} 
                                onChange={checkboxChange}
                                disabled={!isEditMode}/>
                                <label className="form-check-label" htmlFor="checkSMS">SMS notifications</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkEmail" 
                                name="receiveemail"
                                checked={formValues.receiveemail}
                                onChange={checkboxChange}
                                disabled={!isEditMode}/>
                                <label className="form-check-label" htmlFor="checkEmail">Email notifications</label>
                            </div>
                            {formErrors.receiveemail && (
                            <span className="text-danger">{formErrors.receiveemail}</span>
                            )}
                        </div> 

                        <div className="col-md-6">
                            <div className="form-check">
                                <p className="fw-bold mb-1"> Opt in to SMS messages</p>
                                <input className="form-check-input" type="checkbox" id="SMScheck" 
                                name="smsoptin" 
                                checked={formValues.receivesms}
                                onChange={checkboxChange}
                                disabled={!isEditMode} 
                                required={formValues.receivesms}/>
                                <label className="form-check-label" htmlFor="SMScheck">
                                    By opting in you agree to receive SMS notifications about news, updates, volunteer activities.
                                </label>
                                {formErrors.smsoptin && (
                            <span className="text-danger">{formErrors.smsoptin}</span>
                            )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-check">
                                <p className="fw-bold mb-1"> Opt in to email notifications</p>
                                <input className="form-check-input" type="checkbox" id="emailCheck"
                                name="emailoptin"
                                checked={formValues.receiveemail}
                                onChange={checkboxChange}
                                disabled={!isEditMode}
                                required={formValues.receiveemail}/>
                                <label className="form-check-label" htmlFor="emailCheck">
                                    By opting in you agree to receive email notifications about news, updates, volunteer activities.
                                </label>
                                {formErrors.emailoptin && (
                            <span className="text-danger">{formErrors.emailoptin}</span>
                            )}
                            </div>
                        </div>
                    
                        </div>
                        <hr className="mt-5"/>


                        {/* schedPref */}
                    <div className="col-12">
                        <label className="form-label">Schedule Preferences</label>
                        <Select
                            isMulti
                            options={scheduleOptions}
                            value={formValues["schedPref"]}
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "schedPref")}
                            isDisabled={!isEditMode}
                        />
                        {formErrors.schedPref && (
                            <span className="text-danger">{formErrors.schedPref}</span>
                            )}
                    </div>

                    {/* Task Preferences */}
                    <div className="col-12">
                        <label style={{marginTop: '10px'}} className="form-label">Task Preferences</label>
                        <Select
                            isMulti
                            options={taskOptions}
                            value={formValues["taskPref"]}
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "taskPref")}
                            isDisabled={!isEditMode}
                        />
                        {formErrors.taskPref && (
                            <span className="text-danger">{formErrors.taskPref}</span>
                            )}
                    </div>
                        <hr className="mt-5"/>

                        <div>
                            {/* Buttons */}
                <div className="row">
                    <div className="col-12 d-flex justify-content-between">
                        <Button 
                            variant="secondary" 
                            onClick={handleCancel}
                            className="me-2"
                            disabled={!isEditMode}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={toggleEditMode}
                        >
                            {isEditMode ? 'Save' : 'Edit'}
                        </Button>
                    </div>
                </div>

                {/* User message */}
                <div className="mt-3">
                    <span className="text-danger">{usermsg}</span>
                </div>
                        </div> 
                    </form>
                </div>
            </div>
            
        </section>
           
    );
};

export default MyProfile;