const template = ({ fullName, payload }) => {
  const {
    bookingId,
    clientName,
    originalPickupDate,
    originalPickupTime,
    originalDropLocation,
    requestedPickupDate,
    requestedPickupTime,
    requestedDropLocation,
    reasonForReschedule,
  } = payload;

  return `
Dear ${fullName},

A reschedule request has been submitted for the following booking:

### Booking Details
- **Booking ID**: ${bookingId}
- **Client Name**: ${clientName}

### Original Schedule
- **Pickup Date**: ${originalPickupDate}
- **Pickup Time**: ${originalPickupTime}
- **Drop-off Location**: ${originalDropLocation}

### Requested Changes
- **New Pickup Date**: ${requestedPickupDate}
- **New Pickup Time**: ${requestedPickupTime}
- **New Drop-off Location**: ${requestedDropLocation}

### Reschedule Reason
- **Reason for Reschedule**: ${reasonForReschedule}

Please review the request and update the booking as necessary.

Best regards,  
Team DDDCabs
`;
};

module.exports = template;
