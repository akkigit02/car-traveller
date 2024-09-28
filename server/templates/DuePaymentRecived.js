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
Dear ${fullName},

We have successfully received a due payment for the following booking:

- **Booking ID**: ${bookingId}
- **Client Name**: ${clientName}
- **Due Amount**: ${dueAmount}
- **Amount Paid**: ${paidAmount}
- **Payment Method**: ${paymentMethod}
- **Payment Date**: ${paymentDate}

The remaining balance, if any, will be communicated to the customer separately. Please update the booking status as needed.

Best regards,  
Team DDDCabs
`;
};

module.exports = template;
