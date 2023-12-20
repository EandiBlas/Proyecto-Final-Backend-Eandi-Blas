import nodemailer from 'nodemailer'
import config from './config.js'

export const sendPasswordResetEmail = async (recipientEmail, token) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: config.gmail_user,
      pass: config.gmail_password,
    },
  });

  const mailOptions = {
    to: recipientEmail,
    subject: 'Recuperación de contraseña',
    text: `Puedes restablecer tu contraseña utilizando este enlace: http://localhost:8080/api/auth/reset-password/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
};

export const sendMailDeleteUser = async (recipientEmail) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: config.gmail_user,
      pass: config.gmail_password,
    },
  });

  const mailOptions = {
    to: recipientEmail,
    subject: 'Cuenta eliminada',
    text: `Tu cuenta fue borrada por inactividad, pasaron 2 días de tu ultima sesion a nuestro Ecommerce`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });

}

export const sendMailDeleteProduct = async (recipientEmail) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: config.gmail_user,
      pass: config.gmail_password,
    },
  });

  const mailOptions = {
    to: recipientEmail,
    subject: 'Producto Eliminado',
    text: `Tu producto fue eliminado por un administrador del Ecommerce`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });

}

export const sendMailWithPurchaser = async (recipientEmail, ticket) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: config.gmail_user,
      pass: config.gmail_password,
    },
  });

  const { amount, purchase_datetime, code } = ticket;

  const mailOptions = {
    to: recipientEmail,
    subject: 'Compra Exitosa en el Ecommerce E.B',
    text: `Gracias por la compra\n\nDetalles de la compra:\n\nAmount: $${amount}\nPurchase Date and Time: ${purchase_datetime}\nCode: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
};

