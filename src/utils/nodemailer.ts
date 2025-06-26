import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: process.env.APP_EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.APP_EMAIL,                // your Gmail address
        pass: process.env.APP_EMAIL_PASS,          // NOT your Gmail password — use App Password
    },
});

type MailOption = {
    from: string;
    to: string;
    subject: string;
    text: string;
}

export function sendMail(mailOption: MailOption) {
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
}