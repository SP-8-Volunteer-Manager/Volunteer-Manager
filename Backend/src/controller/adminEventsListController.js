const pool = require('../config/supabaseClient');


const getEventLists = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('task')
            .select(`*,
                assignment(volunteer(first_name, last_name)),
                task_type(type_name)
                `);
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
                assignment(volunteer(first_name, last_name))
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

//Save New Event Backend Database Code needs to be implemented
const saveNewEvent = async (req, res) => {
     console.log("in SaveNew Eevent")
     console.log(req.body);
     return res.status(200).json({ message: 'New event created, please close modal'});

    //return res.status(400).json("Event Saved");
}

module.exports = { getEventLists, getUpcomingEvents, saveNewEvent }; // export the controller functions
