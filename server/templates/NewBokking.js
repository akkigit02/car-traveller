const template = ({ fullName, payload }) => {
  const {
    bookingId,
    clientName,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    payableAmount,
    advancePercent,
    bookingType,
    vehicleType,
    vehicleName,
    paymentType,
  } = payload;

  return `
 <div style="margin-top: 20px;">
        <p>Dear ${fullName},</p>
        <p>A new booking has been received with the following details:</p>
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
              <strong style="color: #333;">Pickup Date & Time:</strong> ${pickupDate} at ${pickupTime}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Booking Type:</strong> ${bookingType}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Vehicle Type:</strong> ${vehicleType}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Vehicle Name:</strong> ${vehicleName}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Payment Type:</strong> ${paymentType}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Total Payable Amount:</strong> Rs. ${payableAmount}
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #333;">Advance Percent:</strong> ${advancePercent}%
            </li>
          </ul>
        </div>
        <p>Please review the booking details.</p>
      </div>
  `;
};

module.exports = template;
