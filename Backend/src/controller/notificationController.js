//telnyx@1.27.0

const telnyx = require('telnyx')(process.env.TELNYX_API_KEY, {
    apiVersion: 'v2', 
    maxNetworkRetries: 1,
    timeout: 10000,
    telemetry: false, 
    headers: {
        'Telnyx-SDK-Version': 'custom' 
    }
});
const { htmlToText } = require('html-to-text');



//import loadTelnyx from './telnyxWrapper.js';

const supabase = require('../config/supabaseClient');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);



const sendNotification = async (req, res) => {
    try {
        const { volunteers, message } = req.body;
   
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }
        const volunteerList = Array.isArray(volunteers) ? volunteers : [volunteers];
    
        
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
          //      carrier,
                first_name: firstName,
                last_name: lastName
            } = volunteer;

            const promises = [];

            if (sms && optInSms && phoneNumber) {
                promises.push(sendSMS(volunteer, phoneNumber, message));
                
            }
            if (email) {
                promises.push(sendEmail(volunteer, email_address, message));
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

const sendSMS = async (volunteer, phoneNumber, message) => {
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
        const optOutMessage = `To opt out of notifications, visit: ${process.env.FRONTEND_URL}/optOut/${volunteer.id}`;
        const finalMessage = `
        ${plainText}
        ${optOutMessage}
        `.trim();
        const response = await telnyx.messages.create({
            from: process.env.TELNYX_PHONE_NUMBER,
            to: phone,
            text: finalMessage, 
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

const sendEmail = async (volunteer, recipientEmail, message) => {
    
    console.log(`Sending Email to ${recipientEmail}: ${message}`);
    console.log("message:", message)
    const optOutMessage = `
        <p>If you no longer wish to receive notifications, you can <a href="${process.env.FRONTEND_URL}/optOut/${volunteer.id}">opt out here</a>.</p>
    `;
    const finalMessage = `
        ${message}
        ${optOutMessage}
    `;
    const plainText = htmlToText(finalMessage, {
        wordwrap: null
    });
    const notification = {
        from: `VolunteerManager<${process.env.SENDER_EMAIL}>`,
        to: [recipientEmail],
        subject: 'Volunteer Notification',
        html: finalMessage,
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
const optOut = async (req, res) => {
    const { volunteerId, receivePhone, receiveEmail } = req.body;

    try {
        const { error } = await supabase
            .from("volunteer")
            .update({ receive_phone: receivePhone, receive_email: receiveEmail, consent_for_sms: receivePhone })
            .eq("id", volunteerId);
        if (error) throw error;

        res.status(200).json({ message: "You have successfully changes notifications preferences." });
    } catch (err) {
        console.error("Error updating notifications preferences:", err);
        res.status(500).json({ error: "An error occurred while processing your opt-out request." });
    }
};


module.exports =  { sendNotification,
    sendEmail,
    sendSMS,
    optOut
}
