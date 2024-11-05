import { name } from "ejs";
import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../config';


const NewEvent = ({ show, handleClose }) => {

   
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');

    const [taskType, setTaskType] = useState('0');
    const [taskFreq, setTaskFreq] = useState(false);

    const [shiftPref, setShiftPref] = useState('0');


    
    const [startDate, setStartDate] = useState();
    const [startTime, setStartTime] = useState();

    const [location, setLocation] = useState('');

    const [isDisabled, setIsDisabled] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [isShiftValid, setIsShiftValid] = useState(true);


    const [usermsg, setUserMsg] = useState('');
    const [error, setError] = useState('');



    const handleModalClose = () => {
        setEventName('');
        setDescription('');
        setTaskType('0');
        setShiftPref('0');
        setStartDate();
        setStartTime();
        setLocation('')
        setIsValid(true);
        setIsShiftValid(true);
        setIsDisabled(true);
        setUserMsg('');
        handleClose(); 
    };


    // Handle changes to input fields
    const handleChange = (e) => {
        const { name, value } = e.target;

    };

    const handleEventNameChange = (e) => {
        setEventName(e.target.value);
    }

    const handleEventDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleTaskTypeChange = (e) => {
        //console.log(e.target.value)
        setTaskType(e.target.value);
        setIsValid(e.target.value !== '0');
    }

    const handleShiftPrefChange = (e) => {

        setShiftPref(e.target.value);
        setIsShiftValid(e.target.value !== '0');
    }

    const handleTaskFreqChange = (e) => {
        if (e.target.value == "true")
        {
            setIsDisabled(false);
        }

        if (e.target.value == "false")
            {
                setIsDisabled(true);
                setShiftPref('0');
            }
        setTaskFreq(e.target.value);
    }

    const handleDateChange = (e) => {
        console.log(e.target.value)
        setStartDate(e.target.value);
    }

    const handleTimeChange = (e) => {
        console.log(e.target.value)
        setStartTime(e.target.value);
    }

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    }

    function makeFormData() {
        
        // console.log(eventName);
        // console.log(description);
    
        // console.log(taskType);
        // console.log(taskFreq);
        // console.log(shiftPref);
    
    
        
        //console.log(startDate);

        let dt = startTime.toLocaleDateString('en-CA', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'});
                               
        let tm = dt.split(' ')[1];

        //console.log(tm);
    
        //console.log(location);

        var postData = {
            name:eventName,
            desc:description,
            taskType:taskType,
            taskFreq:taskFreq,
            shiftPref:shiftPref,
            startDate:startDate,
            startTime:tm,
            loc:location,
            };

            return postData;
        
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setUserMsg('');
        if (taskType == '0')
        {
            setIsValid(false);
            return;
        }

        //If recurring task then shift pref must be picked        
        if (taskFreq == "true" && shiftPref == '0')
        {
            setIsShiftValid(false);
            return;
        }
        try{
            
            console.log("In handleSave");
            const postData = makeFormData();
            //console.log(JSON.stringify(formValues));
            const response = await fetch(`${API_BASE_URL}/api/admin/savenewevent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            const result = await response.json();
             console.log("handleSave Response Received: ")
             console.log("result: >>>>")
             console.log(result)
             console.log("response: >>>>")
             console.log(response) 
            if (response.ok) {
                console.log(result.error)
                if (result.error !== '')
                {
                    console.log(result.message);
                    setUserMsg(result.message);
                }
            } else{
                setUserMsg(result.message);
            }
            
        }
         catch(error){
            console.log("Catch Block Error: ")
            console.log(error)
            throw error;
        }

    }

    


    return (
        <>
        <Modal show={show} onHide={handleClose} className="modal-dialog">
        <form onSubmit={handleSave}>
            <Modal.Header>
                <Modal.Title>New Event Details</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                
                    <div className="form-group">
                    <label htmlFor="eventname">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="eventname"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={handleEventNameChange}
                             
                            required
                       />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            placeholder="Brief description of task"
                            value={description}
                            onChange={handleEventDescriptionChange}
                            
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Task Type</label>
                        <div>
                        <select name="taskType" id="taskType" 
                        onChange={handleTaskTypeChange}
                        value={taskType} 
                        required>
                            <option value="0"> -- select an option -- </option>
                            <option value="1">Small Dog</option>
                            <option value="2">Big Dog</option>
                            <option value="3">Cat</option>
                            <option value="4">One Time Event</option>
                            </select>
                            {!isValid && <p style={{ color: 'red' }}>Please select an option</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Task Frequency</label>
                        <div>
                        <label>
                            <input 
                            type="radio" 
                            name="taskFreq"
                            className="radio-new-task"
                            value="false"
                            
                            onChange={handleTaskFreqChange} 
                            />
                            One Time Task
                        </label>
                        <label>
                            <input 
                            type="radio" 
                            value="true" 
                            name="taskFreq"
                            className="radio-new-task"
                            onChange={handleTaskFreqChange} 
                            />
                            Recurring Task
                        </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Shift Type</label>
                        <div>
                        <select name="shiftPref" 
                            id="shiftPref"
                            onChange={handleShiftPrefChange}
                            value={shiftPref}
                            disabled={isDisabled}
                            >
                            <option value="0"> -- select an option -- </option>
                            <option value="43">Monday AM</option>
                            <option value="44">Monday PM</option>
                            <option value="45">Tuesday AM</option>
                            <option value="46">Tuesday PM</option>
                            <option value="47">Wednesday AM</option>
                            <option value="48">Wednesday PM</option>
                            <option value="49">Thursday AM</option>
                            <option value="50">Thursday PM</option>
                            <option value="51">Friday AM</option>
                            <option value="52">Friday PM</option>
                            <option value="53">Saturday AM</option>
                            <option value="54">Saturday PM</option>
                            <option value="55">Sunday AM</option>
                            <option value="56">Sunday PM</option>

                            </select>
                            {!isShiftValid && <p style={{ color: 'red' }}>Please select an option</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <DatePicker 
                            selected={startDate}
                            onChange={(date) => { 
                                let dt = date.toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'});
                                console.log(dt)
                                setStartDate(dt)}}
                            value={startDate} 
                            className="datetimepicker"
                            dateFormat="yyyy/MM/dd"
                            required
                            />
                    </div>
                    <div className="form-group">
                        <label>Time</label>
                        <DatePicker
                            selected={startTime}
                            value={startTime}
                            onChange={(time) => {setStartTime(time)}}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            className="datetimepicker"
                            dateFormat="h:mm aa"
                            required
                            />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            className="form-control"
                            name="location"
                            placeholder="Location of task"
                            onChange={handleLocationChange} 
                            required
                        />
                    </div>
                
            </Modal.Body>
            <Modal.Footer>
            <span className="error">{usermsg}</span>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
                
            </Modal.Footer>
            </form>
        </Modal>
        
        </>
    );
};


export default NewEvent;