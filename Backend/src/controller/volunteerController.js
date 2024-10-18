const pool = require('../config/supabaseClient');

const getVolunteers = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('volunteerdetails')
            .select('*');

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = {getVolunteers};