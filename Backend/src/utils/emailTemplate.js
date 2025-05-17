const bookingConfirmationTemplate = (
  userName,
  location,
  checkIn_date,
  checkOut_date
) => {
  return `
  <h2>Hello ${userName},</h2>
    <p>Thank you for your booking!</p>
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Property:</strong> property- ${location}</li>
        <li><strong>Check-in:</strong> ${checkIn_date}</li>
        <li><strong>Check-out:</strong> ${checkOut_date}</li>
    </ul>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>We hope you have a great stay!</p>
  `;
};

const paymentConfirmationTemplate = (userName, location, status, amount) => {
  return `
  <h2>Hello, ${userName}</h2>
    <p>Your payment has been successfully processed!</p>
    <h3>Payment Details:</h3>
    <ul>
        <li><strong>Amount:</strong> ₹${amount}</li>
        <li><strong>Property:</strong> ${location}</li>
        <li><strong>Payment status:</strong> ${status}</li>
    </ul>
    <p>Thank you for choosing us!</p>
    <p>We look forward to hosting you soon.</p>
  `;
};

const resetPasswordTemplate = (userName, link) => {
  return `
  <h2>Hello, ${userName}</h2>
    <p>Reset password link</p>
    <ul>
        <li><strong>Reset link:</strong> ₹${link}</li>
    </ul>
  `;
};

module.exports = {
  bookingConfirmationTemplate,
  paymentConfirmationTemplate,
  resetPasswordTemplate,
};
