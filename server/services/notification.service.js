const RideModel = require('../models/ride.model')
const UserModel = require('../models/user.model')
const NotificationModel = require('../models/notification.model')
const ObjectId = require('mongoose').Types.ObjectId
const SMTPService = require('../services/smtp.service');
const NewBokkingTemplate = require('../templates/NewBokking')
const NewLeadTemplate = require('../templates/NewLead')
const DuePaymentTemplate = require('../templates/DuePaymentRecived')
const BookingCancelTemplate = require('../templates/BookingCancel')
const BookingReshuduledTemplate = require('../templates/BookingReshuduled');
const { sendBookingConfirmedSms, sendBookingCancelledByPassengerSms, sendRideRescheduledSms } = require('./sms.service');
const { sendBookingConfirmWhatsapp, sendDriverAllotedWhatsapp, sendCancelByPassenger, sendRescheduledToPassenger } = require('./whatsapp.service');

const sendNotificationToAdmin = async (bookingId, type) => {
    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(bookingId) })
      .populate([
        { path: 'pickUpCity', select: 'name' },
        { path: 'dropCity', select: 'name' },
        { path: 'vehicleId', select: 'vehicleType vehicleName' },
        { path: 'paymentId' }
      ]).lean();
    const user = await UserModel.findOne({ _id: bookingDetails.userId })
    const payload = {
      bookingId: bookingDetails.bookingNo,
      clientName: bookingDetails.name,
      phoneNo: user.primaryPhone,
      pickupLocation: bookingDetails.pickupLocation,
      dropLocation: bookingDetails.dropoffLocation,
      pickupDate: `${bookingDetails.pickupDate.date}-${bookingDetails.pickupDate.month}-${bookingDetails.pickupDate.year}`,
      pickupTime: bookingDetails.pickupTime,
      payableAmount: bookingDetails?.paymentId?.payableAmount || bookingDetails.totalPrice,
      advancePercent: bookingDetails?.paymentId?.advancePercent||0,
      vehicleType: bookingDetails.vehicleId.vehicleType,
      vehicleName: bookingDetails.vehicleId.vehicleName,
      bookingType: bookingDetails.trip.tripType,
      paymentType: bookingDetails.paymentId?.isPayLater ? 'Pay Latter' : bookingDetails?.paymentId?.isAdvancePaymentCompleted ? 'Advanced' : '',
      cancellationReason: bookingDetails.reason,
    }
    const notificationData = {
      type,
      data: payload,
      isRead: false,
    }
    const adminList = await UserModel.find({ 'modules.userType': 'ADMIN' }).lean()
    for (const admin of adminList) {
      const emailData = { to: admin.email }
      notificationData['userId'] = admin._id;
      if (type === 'NEW_BOOKING') {
        emailData['subject'] = `New Booking Received - Booking ID: #${bookingDetails.bookingNo}`
        emailData['html'] = NewBokkingTemplate({ fullName: admin.name, payload })
        notificationData['title'] = 'New Bokking Recived';
      }
      else if (type === 'NEW_LEAD') {
        emailData['subject'] = `New Lead Received - Lead ID: #${bookingDetails.bookingNo}`
        emailData['html'] = NewLeadTemplate({ fullName: admin.name, payload })
        notificationData['title'] = 'New Lead Recived';
      }
      else if (type === 'DUE_PAYMENT_RECEIVED') {
        emailData['subject'] = `Due Payment Received - Booking ID: #${bookingDetails.bookingNo}`
        emailData['html'] = DuePaymentTemplate({ fullName: admin.name, payload })
        notificationData['title'] = 'Due Payment Recived';
      }
      else if (type === 'BOOKING_CANCEL') {
        emailData['subject'] = `Booking Cancel - Booking ID: #${bookingDetails.bookingNo}`
        emailData['html'] = BookingCancelTemplate({ fullName: admin.name, payload })
        notificationData['title'] = 'Booking Cancel Recived';
      }
      else if (type === 'BOOKING_RESCHEDULED') {
        emailData['subject'] = `Booking Rescheduled - Booking ID: #${bookingDetails.bookingNo}`
        emailData['html'] = BookingReshuduledTemplate({ fullName: admin.name, payload })
        notificationData['title'] = 'Booking Rescheduled Recived';
      }
      await new SMTPService().sendMail(emailData)
      await NotificationModel.create(notificationData)
    }
  }

  const sendNotificationToClient = async (bookingId, type) => {
    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(bookingId) })
      .populate([
        { path: 'pickUpCity', select: 'name' },
        { path: 'dropCity', select: 'name' },
        { path: 'vehicleId', select: 'vehicleType vehicleName' },
        { path: 'paymentId' }
      ]).lean();
    const user = await UserModel.findOne({ _id: bookingDetails.userId })
    const payload = {
      bookingId: bookingDetails.bookingNo,
      clientName: bookingDetails.name,
      phoneNo: user.primaryPhone,
      pickupLocation: bookingDetails.pickupLocation,
      dropLocation: bookingDetails.dropoffLocation,
      pickupDate: `${bookingDetails.pickupDate.date}/${bookingDetails.pickupDate.month}/${bookingDetails.pickupDate.year}`,
      pickupTime: bookingDetails.pickupTime,
      payableAmount: bookingDetails?.paymentId?.payableAmount || bookingDetails.totalPrice,
      advancePercent: bookingDetails?.paymentId?.advancePercent,
      vehicleType: bookingDetails.vehicleId.vehicleType,
      vehicleName: bookingDetails.vehicleId.vehicleName,
      bookingType: bookingDetails.trip.tripType,
      paymentType: bookingDetails.paymentId?.isPayLater ? 'Pay Latter' : bookingDetails?.paymentId?.isAdvancePaymentCompleted ? 'Advanced' : '',
      cancellationReason: bookingDetails.reason,
    }
    if (type === 'BOOKING_CONFIRM') {
      await sendBookingConfirmedSms(user.primaryPhone, payload)
      await sendBookingConfirmWhatsapp(`91${user.primaryPhone}`, payload)
    }
    else if (type === 'DRIVER_ALLOTED') {
      await sendDriverAllotedWhatsapp(`91${user.primaryPhone}`, payload)
    }
    else if (type === 'BOOKING_CANCEL') {
      await sendCancelByPassenger(`91${user.primaryPhone}`, payload)
      await sendBookingCancelledByPassengerSms(`91${user.primaryPhone}`, payload)
    }
    else if (type === 'BOOKING_RESCHEDULED') {
      await sendRescheduledToPassenger(`91${user.primaryPhone}`, payload)
      await sendRideRescheduledSms(`91${user.primaryPhone}`, payload)
    }
  }

  module.exports = {
    sendNotificationToAdmin,
    sendNotificationToClient

  }