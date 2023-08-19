const express = require('express');
const { PostModel } = require('../model/post.model');

const nodemailer = require('nodemailer');

const PostRouter = express.Router();



PostRouter.post("/", async (req, res) => {
    const {name,  email, message } = req.body;
    const user = await PostModel.find({ email });
try {
        
      if (user.length === 0) {
           let userp = await new PostModel({ name,  email, message, count:1});
                userp.save();
            emailposting(name,email,message);         //  sending email
            res.status(201).send({ msg: "true" });        
        }
        else {
          let userp = await new PostModel({ name,  email, message, count:user.length+1});
          userp.save();
          res.status(201).send({ msg: "true" })
            }
    } catch (error) {
        res.status(400).send({ "msg":error.message })
    }

});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.email',
    port: 587,
    secure: false,
    auth: {
        user: 'landing.page.emails.i.received@gmail.com',
        pass: 'ogiwuecukfkgdgyi'
    
    }
});


function emailposting(name,email,message) {
    const subject = "New Connection Request";
const text = `Hello,\n\nYou have received a new connection request from ${name} (${email}).\n\nMessage: ${message}\n\nBest regards,\nThe Law Connect Team`;

const html = `
<div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
  <h2 style="color: #333;">New Connection Request - Law Connect</h2>
  <p>Hello,</p>
  <p>You have received a new connection request from:</p>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong></p>
  <p style="background-color: #fff; padding: 10px; border-radius: 5px;">${message}</p>
  <p>Best regards,<br>The Law Connect Team</p>
</div>
`;

    transporter
        .sendMail({
            from: "landing.page.emails.i.received@gmail.com",
            to: "jatinlalit010@gmail.com",
            subject: subject,
            text: text,
            html: html,
        })
        .then(() => {
            console.log("Email sent successfully");
        })
        .catch((err) => {
            console.log("Failed to send email:", err);
        });
}

module.exports = { PostRouter }