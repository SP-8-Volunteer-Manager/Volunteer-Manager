const pool = require('../config/supabaseClient');

const getVolunteers = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('volunteer')
            .select(`*,
                shift_prefer(shift(day,time)),
                task_prefer(task_type(type_name)),
                User(email)
                `);

        if (error) {
            throw error;
        }
        
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateVolunteerStatus = async (req, res) => {
    const { id } = req.params;

    // Update the "new" attribute to false
    const { data, error } = await pool
        .from('volunteer')
        .update({ new: false }) // Update the "new" attribute
        .eq('id', id); // Find the volunteer by id

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data });
};

const getNewVolunteersCount = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('volunteer')
            .select('id', { count: 'exact' })
            .eq('new', true);

        if (error) {
            throw error;
        }

        res.status(200).json({ count: data.length }); // Send back the count
    } catch (error) {
        console.error('Error fetching new volunteers count:', error);
        res.status(500).json({ error: 'Error fetching new volunteers count' });
    }
};
   
module.exports = { 
    getVolunteers,
    updateVolunteerStatus,
    getNewVolunteersCount,
};

