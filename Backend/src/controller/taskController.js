const supabase = require('../config/supabaseClient');
const { Resend } = require('resend');
const { sendEmail } = require('./notificationController'); 
const { sendSMS } = require('./notificationController'); 


const resend = new Resend(process.env.RESEND_API_KEY);

const getTaskTypes = async (req, res) => {
  
    try {
        
        // Query the task_type table to get task types
        const { data: taskTypes, error } = await supabase
            .from("task_type")
            .select("*");

        if (error) throw error;

        res.status(200).json(taskTypes);
    } catch (error) {
        console.error("Error fetching task types:", error);
        res.status(500).json({ error: "Error fetching task types." });
    }
};

const getShift = async (req, res) => {
   
    try {
       
        // Query the shift table to get shift
        const { data: shift, error } = await supabase
            .from("shift")
            .select("*");

        if (error) throw error;

        res.status(200).json(shift);
    } catch (error) {
        console.error("Error fetching task types:", error);
        res.status(500).json({ error: "Error fetching task types." });
    }
};



// Create a new task
const createTask = async (req, res) => {
    
    const { name, 
        description, 
        task_type_id, 
        is_recurring, 
        shift_id,
        start_date, 
        start_time, 
        location
    } = req.body;
 
    try{
        if (shift_id) {
            
            const { data: shift, error: shiftError } = await supabase
                .from('shift')
                .select('*')
                .eq('id', shift_id)
                .single();

            if (shiftError || !shift) {
               
                return res.status(400).json({ error: 'Invalid shift ID provided.' });
            }
        
        }

        // Insert new task

        const { data: task, error: taskError } = await supabase
            .from('task')
            .insert([
                { name, 
                    description, 
                    task_type_id, 
                    is_recurring, 
                    shift_id, 
                    start_date, 
                    start_time, 
                    location }
            ]).select()
        

         if (taskError) {
            console.log('Error inserting task:', taskError);
            throw taskError};


        res.status(201).json({ message: "Task created successfully.", task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Error creating task." });
    }

};
// Assign a volunteer to a task
const assignVolunteerToTask = async (req, res)  => {
    const { taskId, 
        volunteerId,
    } = req.body;
   
    try {
        const { data: task, error: taskError } = await supabase
        .from('task')
        .select('*')
        .eq('id', taskId)
        .single();
    
 
    if (taskError) throw taskError;
    try {
        const { error } = await supabase
            .from('assignment')
            .upsert([{
                task_id: taskId,
                volunteer_id: volunteerId,
                assigned_date: new Date(),
                status: 'Assigned',
                start_date: task.start_date,  
                start_time: task.start_time,  
                shift_id: task.shift_id
            }]);

        if (error) throw error;
        return res.status(200).json({ message: 'Volunteer assigned successfully!' });
    } catch (error) {
      
        throw new Error("Error assigning volunteer.");
    }
}
catch (taskError) {
    console.error("Error assigning volunteer:", taskError);
    throw new Error("Error assigning volunteer.");
}
   
};


const createMessageForVolunteers = async (task)  => {

    const { name, location, start_date, start_time, description } = task;
    
     // Convert start_date to MM/DD/YYYY format
     const day = new Date(start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    // Convert start_time to 12-hour format with AM/PM
    const time = new Date(`1970-01-01T${start_time}Z`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    });

    console.log("task: ", task);
    // Generate a default message using task information
    const defaultMessage = `
        <p><strong>Task Alert: ${name}</strong></p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Date:</strong> ${day}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Description:</strong> ${description}</p>
    
    `;
    return defaultMessage;
};


// Helper function to notify volunteers with matching preferences
const notifyMatchingVolunteers = async (req, res)  => {
    const { taskId } = req.body;
   
    try{
        const { data: task, error: taskError } = await supabase
            .from('task')
            .select('*')
            .eq('id', taskId)
            .single();
    
 
        if (taskError) {
            console.error("Error fetching task:", taskError);
            return res.status(500).json({ error: "Error fetching task details." });
        }
        
        const { task_type_id, shift_id } = task;
        
       

        // Retrieve volunteers who match task type and shift preferences
        const { data: volunteers, error: volunteerError } = await supabase
            .from('volunteer')
            .select(`
                *,
                shift_prefer!inner(volunteer_id, shift_id),
                task_prefer!inner(volunteer_id, task_type_id),
                User(email)
            `)
            .eq('shift_prefer.shift_id', shift_id)
            .eq('task_prefer.task_type_id', task_type_id);
       
            
        if (volunteerError) {
            console.error("Error fetching volunteers:", volunteerError);
            return res.status(500).json({ error: "Error retrieving matching volunteers." });
        }

        // Generate the default message for volunteers
        const defaultMessage = await createMessageForVolunteers(task);
        

        const notificationResults = await sendMessageToVolunteers(volunteers, taskId, defaultMessage);

        res.status(200).json({
            message: "Notifications sent successfully!",
            results: notificationResults,
        });
    }
    catch (error) {
        console.error("Error in notifyMatchingVolunteers:", error);
        res.status(500).json({ error: "An error occurred while notifying volunteers." });
    }

};

const sendMessageToVolunteers = async (volunteers, taskId, message) => {
    try {
        // Loop through each volunteer and send a notification with their specific message
        const notificationPromises = volunteers.map(async (volunteer) => {
            const taskLink = `${process.env.FRONTEND_URL}/${taskId}/${volunteer.id}`;
            const personalizedMessage = `${message}<p><a href="${taskLink}">Click here to confirm your availability</a></p>`;

            // Send the notification to the volunteer
            return await sendDirectNotification(volunteer, personalizedMessage);
        });

        // Wait for all notifications to finish
        const notificationResults = await Promise.all(notificationPromises);
        return notificationResults;
    } catch (error) {
        console.error("Error sending notifications to volunteers:", error);
        throw new Error("An error occurred while sending notifications.");
    }
};

const sendDirectNotification = async (volunteer, message) => {
    try {
      
        if (volunteer.receive_phone && volunteer.consent_for_sms) {
            const { phone, carrier } = volunteer;
            console.log(`Sending SMS to ${volunteer.first_name} ${volunteer.last_name} at ${phone} via ${carrier}`);
            await sendSMS(phone, message);
        }
        //volunteer.receive_email has to be added
       
        
        if (volunteer.User?.email) {
            const email = volunteer.User.email;
           await sendEmail(email, message);
        }

        return { volunteerId: volunteer.id, success: true };
    } catch (error) {
        console.error(`Error sending notification to volunteer ID ${volunteer.id}:`, error);
        return { volunteerId: volunteer.id, success: false, error };
    }
};

const getTaskDetails = async (req, res) => {
    const { taskId } = req.params;
  
    try {
        const { data: task, error } = await supabase
            .from('task')
            .select('*')
            .eq('id', taskId)
            .single();

        if (error) throw error;
        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task details:", error);
        res.status(500).json({ error: "Error fetching task details." });
    }
};


module.exports =  { 
 
    getTaskTypes,
    getShift,
    createTask,
    notifyMatchingVolunteers,
    assignVolunteerToTask,
    getTaskDetails
};