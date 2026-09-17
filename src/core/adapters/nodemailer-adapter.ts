import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export const nodemailerAdapter = {
  async sendEmail({
    email,
    confirmationCode,
  }: {
    email: string;
    confirmationCode: string;
  }) {
    const info = await createTransporter().sendMail({
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

  async sendPasswordRecoveryEmail({
    email,
    recoveryCode,
  }: {
    email: string;
    recoveryCode: string;
  }) {
    const info = await createTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'password recovery',
      html: `<h1>Password recovery</h1>
             <p>To finish password recovery please follow the link below:
                 <a href="https://some-front.com/password-recovery?recoveryCode=${recoveryCode}">recovery password</a>
             </p>`,
    });

    console.log('Message sent:', info.messageId);
  },
};
