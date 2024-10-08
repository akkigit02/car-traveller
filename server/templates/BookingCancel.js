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
 <div style="margin-top: 20px;">
        <p>Dear ${fullName},</p>
        <p>We would like to inform you that the following booking has been cancelled:</p>
        <div style="margin-top: 20px;">
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Booking ID:</strong> ${bookingId}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Client Name:</strong> ${clientName}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Pickup Location:</strong> ${pickupLocation}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Drop-off Location:</strong> ${dropLocation}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Pickup Date:</strong> ${pickupDate}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Booking Type:</strong> ${bookingType}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Cancellation Reason:</strong> ${cancellationReason}
            </li>
          </ul>
        </div>
        <p>Please review the cancellation and update the records accordingly. If any further action is required, kindly follow up with the customer.</p>
      </div>

Best regards,  
Team DDDCabs
`;
};

module.exports = template;
