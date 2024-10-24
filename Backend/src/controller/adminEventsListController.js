const pool = require('../config/supabaseClient');


const getEventLists = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('task')
            .select('*');

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
        const { data, error } = await pool
            .from("UpComingEvents") 
            .select('*');

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getEventLists, getUpcomingEvents }; // export the controller functions
