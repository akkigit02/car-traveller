const template = ({ fullName, payload }) => {
  const {
    bookingId,
    clientName,
    dueAmount,
    paidAmount,
    paymentMethod,
    paymentDate
  } = payload;

  return `
<div style="margin-top: 20px;">
        <p>Dear ${fullName},</p>
        <p>We have successfully received a due payment for the following booking:</p>
        <div style="margin-top: 20px;">
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Booking ID:</strong> ${bookingId}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Client Name:</strong> ${clientName}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Due Amount:</strong> Rs. ${dueAmount}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Amount Paid:</strong> Rs. ${paidAmount}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Payment Method:</strong> ${paymentMethod}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Payment Date:</strong> ${paymentDate}
            </li>
          </ul>
        </div>
        <p>The remaining balance, if any, will be communicated to the customer separately. Please update the booking status as needed.</p>
      </div>
`;
};

module.exports = template;
