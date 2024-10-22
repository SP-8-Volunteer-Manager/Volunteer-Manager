// src/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Route for sending messages (email notification)
router.post('/sendMessage', (req, res) => {
    console.log("sendMessage route hit");
    const { name, email, phone, message } = req.body;

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_EMAIL, 
        subject: `Contact Form Submission from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Message: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending mail:', error.message); 
            return res.status(500).json({ error: 'Error sending message' }); // Return JSON on error
        } else {
            console.log('Message sent: ' + info.response);
            return res.status(200).json({ message: 'Message sent successfully' }); // Return JSON on success
        }
    });
});

module.exports = router; // Export the router