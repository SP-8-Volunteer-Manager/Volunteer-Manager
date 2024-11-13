const pool = require('../config/supabaseClient');


const getEventLists = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { data, error } = await pool
            .from('task')
            .select(`*,
                assignment(volunteer(first_name, last_name)),
                task_type(type_name)
                `)
                .gte('start_date', today.toLocaleString())
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


module.exports = { getEventLists, getUpcomingEvents }; // export the controller functions
