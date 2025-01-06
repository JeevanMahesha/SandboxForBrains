const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SG_API_KEY);

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'enroloenrolo@gmail.com',
        subject: 'Welcome to RingGall',
        text: `Hi ${name}, Welcome to RingGall. 
        Your Account Created Successfully.
        What happens next? 
        Start Uploading and Download the images,ringtones.`
    })
}

module.exports = {
    sendWelcomeMail
}