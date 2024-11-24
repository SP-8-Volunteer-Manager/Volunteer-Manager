const pool = require('../config/supabaseClient');
const { sendNotification } = require('./notificationController');

//This method will return events greater than or equal today by default. 
//If the showall parameter is true it will return events from one month before onwards
const getEventLists = async (req, res) => {
    try {
        const { showAll } = req.params;
        const cutoffdate = new Date();
        if (showAll == "undefined" || showAll == "true")
        {
            //console.log("Set cutoff date to one month back")
            cutoffdate.setMonth(cutoffdate.getMonth() - 1);
        }
       
        cutoffdate.setHours(0, 0, 0, 0);
        const { data, error } = await pool
            .from('task')
            .select(`*,
                assignment(volunteer(id, first_name, last_name)),
                task_type(id, type_name)
                `)
                .gte('start_date', cutoffdate.toLocaleString())
                .order('start_date', { ascending: true })
                .order('start_time', { ascending: true });
                //console.log(data)
        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUpcomingEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);
        const { data, error } = await pool
            .from("task") 
            .select(`
                *,
                assignment(volunteer(id, first_name, last_name)),
                task_type(id, type_name)
            `)
            .gte('start_date', today.toISOString())
            .lte('start_date', next7Days.toISOString());  

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params; // Event ID
        const { name, description, taskType, day, time, location } = req.body;

        // Update the task in the database
        const { data, error } = await pool
            .from('task')
            .update({
                name,
                description,
                task_type_id: taskType, // Assuming taskType is the ID
                start_date: day,
                start_time: time,
                location,
            })
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Event updated successfully', data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const cancelEvent = async (req, res) => {
  //  const message = "Hi";
    const event = {};
    try {
        // -------------------- Get Task info
        const volNotifData = [];
        const { taskid } = req.params;
        console.log("Taskid",taskid)
        const { data: event, error: terror } = await pool
        .from('task') 
        .select(`*`)
        .eq('id', taskid)
        .single();
        if (terror)
        {
            throw new Error("Error retrieving data", terror)
        }
        
        //Build cancel message
        const message = `<p><strong>The following event: '${event.name}' has been cancelled!</strong></p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Date:</strong> ${event.start_date}</p>
        <p><strong>Time:</strong> ${convertMilitaryTo12Hour(event.start_time)}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <p>Thank you</p>`;

        //-------------Get assigned Volunteers-----------------
        const { data: vdata, error: verror } = await pool
        .from('assignment') 
        .select(`volunteer_id`)
        .eq('task_id', taskid);

        if (verror)
        {
            throw verror
        }
        const volunteerIds = vdata.map(row => parseInt(row.volunteer_id, 10)); // Ensures all values are integers
        console.log("volidlength", volunteerIds.length)
        // ----- 
        if (volunteerIds.length > 0)
        {
            const { data, error: vierror } = await pool
            .from('volunteer') 
            .select(`id, receive_email, phone, consent_for_sms, carrier, first_name, last_name, User(email)`)
            .in('id', volunteerIds);
    
            if (vierror)
            {
                throw vierror
            }
            
            volNotifData.push(...data)

        }
//------------Delete From Databse------------------------------
        

        console.log("Delete from assignment table using taskid")
        const {data: adata, error: aerror} = await pool 
        .from('assignment')
        .delete()
        .eq('task_id', taskid);

        if (aerror)
        {
            return res.status(200).json({message: "Assignment delete error"})
        }
        
        console.log("Delete from vac table using taskid")
        const { data: vacdata, error: vacerror } = await pool
            .from('volunteer_availability_confirmation')
            .delete()
            .eq('task_id', taskid);

        if (vacerror) {
            return res.status(200).json({message: "Availability delete error"})
        }

        console.log("Delete from task using taskid")
        const {data: tkdata, error: tkerror} = await pool 
        .from('task')
        .delete()
        .eq('id', taskid);

        console.log(tkerror)
        if (tkerror)
        {
            return res.status(200).json({message: "Task delete error"})
        }

//--------Notify volunteers if required-------------
        if (volunteerIds.length > 0)
        {
            // Create a mock req object
            const mockReq = {
                body: {
                    volunteers: volNotifData,
                    message: message,
                },
            };

            // Mock res object to capture the response
            const mockRes = {
                status: (code) => {
                    console.log(`Response status: ${code}`);
                    return {
                        json: (data) => {
                        console.log("Response JSON:", data);
                        if (code == 200)
                            res.status(code).json({message: `Task canceled, ${volunteerIds.length} volunteer(s) notified!`});
                        else 
                            res.status(code).json({ message: "Error sending notification!" });
                        },
                    };
                },
            };

            // Call the sendNotification function
            await sendNotification(mockReq, mockRes);
        } else // no assigned volunteers
        {
            console.log("no vol assigned notifs bypassed")
            return res.status(200).json({message: "Task successfully canceled"});
        }
    } catch (error) {
        res.status(400).json({ message: "Error canceling task" });
    }
};

function convertMilitaryTo12Hour(time) {
    if (!time) return 'N/A';

    // Split the input time string into hours and minutes
    let [hours, minutes] = time.split(":").map(Number);
  
    // Determine if the time is AM or PM
    const suffix = hours >= 12 ? "PM" : "AM";
  
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // '0' becomes '12' in 12-hour format
  
    // Return formatted time with padded hours, minutes, and seconds
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

module.exports = { getEventLists, getUpcomingEvents, updateEvent, cancelEvent}; // export the controller functions
