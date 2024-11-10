const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const {convert} = require('html-to-text');

function newTransport() {
    /*
  if (process.env.NODE_ENV === 'production') {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
  }
*/
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}
// Function to read and compile Handlebars template
function compileTemplate(templateFile, data) {
  const template = fs.readFileSync(templateFile, 'utf8');
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
}

// Function to send email
async function sendEmail(user, url, templateFile, subject) {
  const firstName = user.name.split(' ')[0];
  
  // 1) Render HTML based on a Handlebars template
  const html = compileTemplate(templateFile, {
    firstName,
    url,
    subject
  });

  // 2) Define email options
  const mailOptions = {
    from: `Ahmed Cherifi <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject,
    html,
    text: convert(html)
  };

  // 3) Create a transport and send email
  await newTransport().sendMail(mailOptions);
}

// Function to send welcome email
async function sendWelcomeEmail(user, url, templateFile) {
  await sendEmail(user, url, templateFile, 'Welcome to the Ecommerce Website!');
}

// Function to send password reset email
async function sendPasswordResetEmail(user, url, templateFile) {
  await sendEmail(
    user,
    url,
    templateFile,
    'Your password reset token (valid for only 10 minutes)'
  );
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail
};
