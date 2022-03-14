import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9db3c404c3f51f",
      pass: "465e6cc40c17e3"
    }
  });