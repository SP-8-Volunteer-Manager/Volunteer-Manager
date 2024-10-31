const supabase = require('../config/supabaseClient');

const carrierGateways = {
    "Verizon": "vtext.com",
    "AT&T": "txt.att.net",
    "Metro by T-Mobile": "tmomail.net",
    "Sprint": "messaging.sprintpcs.com",
    "US Cellular": "email.uscc.net",
    "Virgin Mobile": "vmobl.com"
   
};
const nodemailer = require('nodemailer');

const sendSMSToVolunteer = async (req, res) => {
    try {
        const { phoneNumber, carrier, message, optInSms } = req.body;

        if (!phoneNumber || !message || !carrier) {
            console.error("Missing fields:", { phoneNumber, message, carrier });
            return res.status(400).json({ error: "Volunteer ID, message, and carrier are required." });
        }
        if (!optInSms) {
            return res.status(403).json({ error: "User has not opted in for SMS notifications." });
        }
        const carrierGateway = carrierGateways[carrier];
        const emailToSMSAddress = `${phoneNumber}@${carrierGateway}`;
        console.log("Email to SMS address:", emailToSMSAddress);


        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });


        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailToSMSAddress,
            subject: 'Volunteer Notification',
            text: message,
        });

        res.status(200).json({ message: "SMS notification sent successfully!" });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

module.exports = { sendSMSToVolunteer };
{/*

const sendSMSToVolunteer = async (req, res) => {
    try {
        const { phoneNumber, carrier, message, optInSms } = req.body;

        if (!phoneNumber || !carrier || !message) {
            return res.status(400).json({ error: "Phone number, carrier, and message are required." });
        }
        if (!optInSms) {
            return res.status(403).json({ error: "User has not opted in for SMS notifications." });
        }
        const carrierGateway = carrierGateways[carrier];
        const emailToSMSAddress = `${phoneNumber}@${carrierGateway}`;
        console.log("Email to SMS address:", emailToSMSAddress);
        const { error } = await supabase.auth.api.sendMagicLinkEmail(emailToSMSAddress, {
            subject: 'Volunteer Notification',
            html: `<p>${message}</p>`
        });

        if (error) {
            console.error("Error sending SMS notification:", error.message);
            return res.status(500).json({ error: "Failed to send SMS notification." });
        }

        res.status(200).json({ message: "SMS notification sent successfully!" });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};
*/}
module.exports = { sendSMSToVolunteer };