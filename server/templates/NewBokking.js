const template = ({ fullName, payload }) => {
  const {
    bookingId,
    clientName,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    payableAmount,
    advancePayment,
    bookingType,
    vehicleType,
    vehicleName,
    paymentType,
    } = payload;

  return `
  Dear ${fullName},
  
  A new booking has been received with the following details:
  
  - **Booking ID**: ${bookingId}
  - **Client Name**: ${clientName}
  - **Pickup Location**: ${pickupLocation}
  - **Drop-off Location**: ${dropLocation}
  - **Pickup Date & Time**: ${pickupDate} at ${pickupTime}
  - **Booking Type**: ${bookingType}
  - **Vehicle Type**: ${vehicleType}
  - **Vehicle Name**: ${vehicleName}
  - **Payment Type**: ${paymentType}
  ${paymentType == 'Advanced' ? '- **Total Payable Amount**: Rs. ' + payableAmount : ''}
  - **Advance Payment**: ${advancePayment}
  
  Please review the booking details.
  
  Best regards,  
  Team DDDCabs
  `;
};

module.exports = template;
