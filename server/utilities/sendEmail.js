const sgMail = require('@sendgrid/mail')
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ( {to, subject, text, html} ) => {
    const msg = {
        to,
        from: 'shravya.chepa@gmail.com',
        subject,
        text,
        html
    };

    try {
        await sgMail.send(msg)
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.error(`Error sending email to ${to}: `, error)
    }
};

module.exports = sendEmail;