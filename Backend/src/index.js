const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config({ path: './src/.env' }); // Change this line
// Load environment variables from .env file
const { createClient } = require('@supabase/supabase-js');

const corsOption = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOption));
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ f: ["a", 'b'] });
});

// Access the environment variables
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY; 

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY);

// Check if environment variables are defined
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Key is undefined');
    process.exit(1); // Exit if the variables are not set
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.get('/', (req, res) => {
    res.send('Backend server with Supabase is running');
});

// API Route to Get Todos from Supabase
app.get('/todos', async (req, res) => {
    try {
        const { data: todos, error } = await supabase.from('todos').select();

        if (error) {
            console.error('Error fetching todos:', error);
            return res.status(500).json({ error: 'Failed to fetch todos' });
        }

        res.json(todos);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
