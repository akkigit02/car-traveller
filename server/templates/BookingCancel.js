const template = ({ fullName, payload }) => {
  const {
    bookingId,
    clientName,
    cancellationReason,
    pickupLocation,
    dropLocation,
    pickupDate,
    bookingType
  } = payload;

  return `
Dear ${fullName},

We would like to inform you that the following booking has been cancelled:

- **Booking ID**: ${bookingId}
- **Client Name**: ${clientName}
- **Pickup Location**: ${pickupLocation}
- **Drop-off Location**: ${dropLocation}
- **Pickup Date**: ${pickupDate}
- **Booking Type**: ${bookingType}
- **Cancellation Reason**: ${cancellationReason}

Please review the cancellation and update the records accordingly. If any further action is required, kindly follow up with the customer.

Best regards,  
Team DDDCabs
`;
};

module.exports = template;
