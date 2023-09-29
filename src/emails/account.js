const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const key = process.env.MAILGUN_API_KEY;
const mg = mailgun.client({
  username: 'api',
  key,
});

// sending welcome message

const sendWelcomeMessage = async (name) => {
  try {
    const res = await mg.messages.create(
      'sandboxefb2a4d8fe5249e495398fd59beac50c.mailgun.org',
      {
        from: 'Task app <mailgun@sandboxefb2a4d8fe5249e495398fd59beac50c.mailgun.org>',
        to: ['igweedwin15@gmail.com'],
        subject: 'Thanks for signing up',
        text: `Welcome to the Task manager app ${name}.`,
        html: `<h1>Let me know how you get along with the app ${name}!</h1>`,
      }
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendWelcomeMessage };
