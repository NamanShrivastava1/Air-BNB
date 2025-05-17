const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lalashrivastava1234@gmail.com",
    pass: "qwnujpwjaxzwunfy",
  },
});

exports.sendMail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: "lalashrivastava@gmail.com",
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};
