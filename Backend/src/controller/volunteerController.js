const supabase = require('../config/supabaseClient');

const getVolunteers = async (req, res) => {
    try {
        const { data, error } = await supabase
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
    const { data, error } = await supabase
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
        const { data, error } = await supabase
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

const updateVolunteer = async (req, res) => {
    const volunteerId = req.params.id;
    const { volunteerData, schedulePreferences, taskPreferences } = req.body;

    try {
        // Update the volunteer table
        const { data: volunteerUpdate, error: volunteerError } = await supabase
            .from('volunteer')
            .update(volunteerData)
            .eq('id', volunteerId);

        if (volunteerError) throw volunteerError;

        // Update or Insert Schedule Preferences
        const scheduleUpdates = schedulePreferences.map(preference => ({
            volunteer_id: volunteerId,
            ...preference,
        }));
        const { error: scheduleError } = await supabase
            .from('schedule_preferences')
            .upsert(scheduleUpdates, { onConflict: ['volunteer_id', 'day', 'time'] });

        if (scheduleError) throw scheduleError;

        // Update or Insert Task Preferences
        const taskUpdates = taskPreferences.map(task => ({
            volunteer_id: volunteerId,
            ...task,
        }));
        const { error: taskError } = await supabase
            .from('task_preferences')
            .upsert(taskUpdates, { onConflict: ['volunteer_id', 'task_type_id'] });

        if (taskError) throw taskError;

        res.status(200).json({ message: 'Volunteer information updated successfully.' });
    } catch (error) {
        console.error('Error updating volunteer information:', error);
        res.status(500).json({ error: 'Failed to update volunteer information.' });
    }
};

// Fetch schedule preferences from the 'shift' table
const getSchedulePreferences = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('shift')
            .select('day, time'); // Supabase query to select specific columns

        if (error) throw error; // Handle error from Supabase

        const scheduleOptions = data.map(shift => ({
            day: shift.day,
            time: shift.time,
        }));

        res.status(200).json(scheduleOptions);
    } catch (error) {
        console.error("Error fetching schedule preferences:", error.message);
        res.status(500).json({ error: "Failed to fetch schedule preferences." });
    }
};


// Fetch task preferences from the 'task_type' table
const getTaskOptions = async (req, res) => {
    try {
        const { data, error } = await pool
            .from('task_type')
            .select('id, type_name'); // Ensure to select both id and type_name

        if (error) throw error; // Handle error from Supabase

        const taskOptions = data.map(task => ({
            id: task.id,
            type_name: task.type_name,
        }));
        
        res.status(200).json(taskOptions);
    } catch (error) {
        console.error("Error fetching task options:", error.message);
        res.status(500).json({ error: "Failed to fetch task options." });
    }
};



   
module.exports = { 
    getVolunteers,
    updateVolunteerStatus,
    getNewVolunteersCount,
    updateVolunteer,
    getSchedulePreferences,
    getTaskOptions,
};

