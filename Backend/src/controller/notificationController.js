//telnyx@1.27.0

const telnyx = require('telnyx')(process.env.TELNYX_API_KEY, {
    apiVersion: 'v2', 
    maxNetworkRetries: 1,
    timeout: 10000,
    telemetry: false, // Disables telemetry if active
    headers: {
        'Telnyx-SDK-Version': 'custom' // Custom header to reduce debug output
    }
});
const { htmlToText } = require('html-to-text');



//import loadTelnyx from './telnyxWrapper.js';

const supabase = require('../config/supabaseClient');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);



const carrierGateways = {
    "Verizon": "vtext.com",
    "AT&T": "txt.att.net",
    "Metro by T-Mobile": "tmomail.net",
    "Sprint": "messaging.sprintpcs.com",
    "US Cellular": "email.uscc.net",
    "Virgin Mobile": "vmobl.com"
   
};


const sendNotification = async (req, res) => {
    try {
        const { volunteers, message } = req.body;
        console.log("volunteers", volunteers);
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }
        const volunteerList = Array.isArray(volunteers) ? volunteers : [volunteers];
        console.log("volunterr list", volunteerList);
        
        if (!volunteerList || volunteerList.length === 0 || !message) {
            return res.status(400).json({ error: "Volunteers array or object and message are required." });
        }
      
        const notificationPromises = volunteerList.map(async volunteer => {

            const { receive_phone: sms,
                receive_email: email,
                User: { email: email_address },
                phone: phoneNumber,
                consent_for_sms: optInSms,
           //     consent_for_email: optInEmail, 
                carrier,
                first_name: firstName,
                last_name: lastName
            } = volunteer;

            const promises = [];

            if (sms && optInSms && phoneNumber && carrier) {
                promises.push(sendSMS(phoneNumber, message));
                
            }
            if (email) {
                promises.push(sendEmail(email_address, message));
            } 
            
            
            try {
                await Promise.all(promises);
            } catch (error) {
                console.error(`Error sending notification to volunteer ID ${volunteer.id}:`, error);
                
            }
        });
       

     // Wait for all notifications to complete
     console.log('Starting to send notifications...');
     await Promise.all(notificationPromises);
     console.log('All notifications have been processed.');
     res.status(200).json({ message: "Notifications sent successfully!" });
     

    } catch (err) {
        console.error("Error sending notifications:", err.message);
        res.status(500).json({ error: "An error occurred while sending notifications." });
    }
};

const sendSMS = async (phoneNumber, message) => {
    try {

       
      //  const telnyx = await loadTelnyx(); 
        if (!telnyx.messages) {
            console.error('Telnyx client is not properly initialized.');
            throw new Error('Telnyx client is not properly initialized.');
        }
        console.log("Telnyx client:", telnyx);
        const phone = `+1${phoneNumber}`;
        console.log("Sending SMS to:", phone); 
        //Send SMS message
        const plainText = htmlToText(message, {
            wordwrap: null
        });
        const response = await telnyx.messages.create({
            from: process.env.TELNYX_PHONE_NUMBER,
            to: phone,
            text: plainText, 
        });
        //.then(function(response){
        //    const message = response.data; // asynchronously handled
        //});
        console.log("Response from Telnyx:", response);

      //  console.log('SMS sent successfully:', message);
        return message;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Failed to send SMS');
    }
};

// const sendSMS = async (phoneNumber, message, carrier) => {
//     const carrierGateway = carrierGateways[carrier];
//     if (!carrierGateway) {
//         console.error(`No gateway found for carrier: ${carrier}`);
//         return;
//     }

//     recipient = `${phoneNumber}@${carrierGateway}`;

//     console.log(`Sending SMS to ${recipient}: ${message}`);

//     const notification = {
//         from: `VolunteerManager<${process.env.SENDER_EMAIL}>`,
//         to: [recipient],
//         subject: 'Volunteer Notification',
//         html: message,
//         text: message.replace(/<[^>]*>/g, '')
//     };


//     // Send sns using Resend
//     try {
//         await resend.emails.send(notification);
//         console.log(`Notification sent to: ${recipient}`);
//     } catch (error) {
//         console.error(`Error sending email to ${recipient}:`, error);
//     }

{/*
const nodemailer = require('nodemailer');
try{
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,,
        to: [recipient],
        subject: 'Volunteer Notification',
        html: message,
        text: message.replace(/<[^>]*>/g, '')
    });
    console.log(`Notification sent to: ${recipient}`);
} catch (err) {
    console.error(`Error sending email to ${recipient}:`, err.message);
}
    */}

//};


const sendEmail = async (recipientEmail, message) => {
    
    console.log(`Sending Email to ${recipientEmail}: ${message}`);
    console.log("message:", message)
    const plainText = htmlToText(message, {
        wordwrap: null
    });
    const notification = {
        from: `VolunteerManager<${process.env.SENDER_EMAIL}>`,
        to: [recipientEmail],
        subject: 'Volunteer Notification',
        html: message,
        text: plainText
    };

    // Send email using Resend
    try {
        await resend.emails.send(notification);
        console.log(`Notification sent to: ${recipientEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error);
    }

};
{/*}
const sendSMSToVolunteer = ( phoneNumber, carrier,  message, optInSms) => {
  //  try {
   //     const { phoneNumber, carrier, message, optInSms } = req.body;
        console.log("phone",phoneNumber)
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

{/*
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailToSMSAddress,
            subject: 'Volunteer Notification',
            text: message,
        }, (error, info) => {
            if (error) {
                console.error("Error sending SMS:", error);
                return done(err);
            } else {
                console.log("Sending to SMS address:", emailToSMSAddress);
                console.log("SMS sent:", info.response);
                done();
            }
        });
*/}

//     res.status(200).json({ message: "SMS notification sent successfully!" });
// } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).json({ error: "An unexpected error occurred." });
// }
//};


module.exports =  { sendNotification,
    sendEmail,
    sendSMS
}
