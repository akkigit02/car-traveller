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
  Hi ${fullName},
  
  You have a new inquiry from a potential customer. Here are the details:
  
  - **Lead ID**: ${bookingId}
  - **Client Name**: ${clientName}
  - **Client Phone**: ${phoneNo}
  - **Pickup Location**: ${pickupLocation}
  - **Drop-off Location**: ${dropLocation}
  - **Pickup Date & Time**: ${pickupDate} at ${pickupTime}
  - **Booking Type**: ${bookingType}
  - **Vehicle Type**: ${vehicleType}
  - **Vehicle Name**: ${vehicleName}
  - **Booking Amount**: ${payableAmount}
   
  Please follow up with the customer at your earliest convenience to convert this lead into a booking.
  
  Best regards,  
  Team DDDCabs
  `;
};

module.exports = template;
