// src/index.js

const express = require("express");
require('dotenv').config();
const cors = require("cors");

const supabase = require('./config/supabaseClient'); // Import the Supabase client
const app = express();
const authRoutes = require('./routes/authRoutes');
const VolunteerRoutes = require('./routes/volunteerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminEventsListRoutes = require('./routes/adminEventsListRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');

const corsOption = {
    origin: ["http://localhost:5173"],
};


app.use(cors(corsOption));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminEventsListRoutes);
app.use('/api/admin', VolunteerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notification', notificationRoutes);




// Simple route to check if the server is running
app.get('/', (req, res) => {
    res.send('Backend server with Supabase is running');
});


// API Route to Get Todos from Supabase
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
