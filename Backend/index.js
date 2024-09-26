// src/index.js

const express = require("express");
const cors = require("cors");
const supabase = require('./config/supabaseClient'); // Import the Supabase client

const app = express();

const corsOption = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOption));
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ f: ["a", 'b'] });
});

// Simple route to check if the server is running
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
