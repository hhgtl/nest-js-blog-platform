import nodemailer from 'nodemailer';

export const nodemailerAdapter = {
  async sendEmail({
    email,
    confirmationCode,
  }: {
    email: string;
    confirmationCode: string;
  }) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'register',
      html: `<h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href="https://some-front.com/confirm-registration?code=${confirmationCode}">complete registration</a>
             </p>`,
    });

    console.log('Message sent:', info.messageId);
  },
};
