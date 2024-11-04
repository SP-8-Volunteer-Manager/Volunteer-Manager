// src/config/supabaseClient.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './src/.env' }); // Load .env file

// Access environment variables
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY; 

// Check if environment variables are defined
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Key is undefined');
    process.exit(1); // Exit if the variables are not set
}



// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase; // Export the Supabase client
