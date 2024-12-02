const supabase = require('../config/supabaseClient');
const confirmAvailability = async (req, res) => {
    const { taskId, volunteerId } = req.query;

    
    if (!taskId || !volunteerId) {
        return res.status(400).json({ error: 'taskId and volunteerId are required.' });
    }

    try {
         // Check if confirmation already exists
         const { data: confirmation, error: confirmationError } = await supabase
            .from('volunteer_availability_confirmation')
            .select('*')
            .eq('task_id', taskId)
            .eq('volunteer_id', volunteerId)
            .limit(1);  // Ensure we're limiting to one result

        if (confirmationError) {
            console.error("Error checking for confirmation:", confirmationError);
            return res.status(500).json({ error: 'Error checking for existing confirmation.' });
        }
        if (confirmation && confirmation.length > 0) {
             // Update the existing confirmation record if it exists
             const { error: updateError } = await supabase
             .from('volunteer_availability_confirmation')
             .update({ confirmation_time: new Date().toISOString() })
             .eq('task_id', taskId)
             .eq('volunteer_id', volunteerId);

         if (updateError) {
             console.error("Error updating confirmation:", updateError);
             return res.status(500).json({ error: 'Error updating confirmation.' });
         }

         return res.status(200).json({ message: 'Your confirmation has been received. If you are assigned to this task, you will receive an additional notification.' });
        }

        // Add a new confirmation record
        const { error: insertError } = await supabase
            .from('volunteer_availability_confirmation')
            .insert({ task_id: taskId, volunteer_id: volunteerId, confirmed: true, confirmation_time: new Date().toISOString() });

            if (insertError) {
                console.error("Error inserting confirmation:", insertError);
                return res.status(500).json({ error: 'Error inserting confirmation.' });
            }

        res.status(200).json({ message: 'Your confirmation has been received. If you are assigned to this task, you will receive an additional notification.' });
    } catch (error) {
        console.error("Error confirming availability:", error);
        res.status(500).json({ error: "Error confirming availability." });
    }
};
const getAvailableVolunteers = async (req, res) => {
    const { taskId } = req.params;
    if (!taskId || isNaN(taskId)) {
        console.error("Invalid taskId:", taskId);
        return res.status(400).json({ error: 'Invalid taskId' });
    }
    try {
        const { data: confirmation, error: confirmationError } = await supabase
            .from('volunteer_availability_confirmation')
            .select(`id,
                volunteer_id,
                confirmed,
                volunteer:volunteer_id (
                    id,
                    first_name,
                    last_name
                )`)
            .eq('task_id', taskId);


        if (confirmationError) {
            console.error("Error checking for confirmation:", confirmationError);
            return res.status(500).json({ error: 'Error checking for existing confirmation.' });
        }

        if (confirmation) {
            // Case where confirmation exists
            return res.status(200).json(confirmation);
        } else {
            // Case where no confirmation exists
            return res.status(200).json({ message: 'No confirmation found.' });
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

module.exports = { confirmAvailability,  getAvailableVolunteers};