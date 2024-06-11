const nodemailer = require('nodemailer');
exports.sendEmail = async (req, res) => {
    const {to,subject,body} = req.body;
    const attachments = req.files.map(file =>({
        filename: file.originalname,
        content:file.buffer
    }));
    const senderEmail = req.user.email;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abhatt2811@gmail.com',
            pass: "pmww avia fqwd ritt", // Your email password or app password
    
        }
    });
    const mailOptions = {
        from:senderEmail,
        to,
        subject,
        text:body,
        attachments
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
}
