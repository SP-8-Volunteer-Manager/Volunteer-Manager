const pool = require('../config/supabaseClient');


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
                assignment(volunteer(id, first_name, last_name))
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



module.exports = { getEventLists, getUpcomingEvents,updateEvent }; // export the controller functions
