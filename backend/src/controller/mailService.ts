import nodemailer from "nodemailer" 
import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.join(process.cwd(), '.env') });
import { MessageClient } from "cloudmailin"

const transporter = nodemailer.createTransport({
    port : 465,
    host: process.env.SMTP_HOST || "",
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    },
    from: process.env.EMAIL_FROM,
    secure: true
})

export function sendEmail(to: string, subject: string, html: string) {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " + info.response)
        }
    })
}

export async function sendResetEmail(to: string, token: string) {

    console.log(process.env.EMAIL_FROM)

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: "Password Reset",
        text: "test",
        html: `<p>Click <a href="http://localhost:4000/api/v1/user/setNewPassword">here</a> and use the following token ${token}</p>`,
    }

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " + info.response)
        }
    }
    )
}


