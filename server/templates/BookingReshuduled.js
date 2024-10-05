const template = ({ fullName, payload }) => {
  const {
    bookingId,
    clientName,
    phoneNo,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    payableAmount,
    bookingType,
    vehicleType,
    vehicleName
   
  } = payload;

  return `
Dear ${fullName},

A reschedule request has been submitted for the following booking:

  - **Booking ID**: ${bookingId}
  - **Client Name**: ${clientName}
  - **Client Phone**: ${phoneNo}
  - **Pickup Location**: ${pickupLocation}
  - **Drop-off Location**: ${dropLocation}
  - **Pickup Date & Time**: ${pickupDate} at ${pickupTime}
  - **Booking Type**: ${bookingType}
  - **Vehicle Type**: ${vehicleType}
  - **Vehicle Name**: ${vehicleName}
  - **Booking Amount**: ${payableAmount}
Please review the request and update the booking as necessary.

Best regards,  
Team DDDCabs
`;
};

module.exports = template;
