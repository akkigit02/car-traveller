
const PaymentModel = require('../models/payment.model')
const RideModel = require('../models/ride.model')
const puppeteer = require('puppeteer');
const { getDateAndTimeString, roundToDecimalPlaces } = require('../utils/format.util');
const { TRIP_TYPE, HOURLY_TYPE } = require('../../client/app/src/constants/common.constants');
const incrementBookingNumber = async (rideId) => {
  const generateBookingNumber = (lastBookingNo) => {
    const prefix = 'DDD';
    let newCount = 1
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (lastBookingNo) {
      const lastYear = parseInt(lastBookingNo.substring(3, 7)); // YYYY
      const lastMonth = parseInt(lastBookingNo.substring(7, 9)); // MM
      const lastCount = parseInt(lastBookingNo.substring(9)); // ####
      newCount = (currentYear !== lastYear || currentMonth !== lastMonth) ? 1 : lastCount + 1;
    }
    const formattedMonth = String(currentMonth).padStart(2, '0');
    const formattedCount = String(newCount).padStart(4, '0');
    return `${prefix}${currentYear}${formattedMonth}${formattedCount}`;
  }
  const ride = await RideModel.find({ bookingNo: { $exists: 1 } }).sort({ createdOn: -1 }).limit(1)
  const lastBookingNo = ride[0]?.bookingNo || null
  let ID = generateBookingNumber(lastBookingNo)
  const isExist = await RideModel.exists({ bookingNo: ID })
  if (isExist) {
    ID = generateBookingNumber(lastBookingNo)
  }
  await RideModel.updateOne({ _id: rideId }, { $set: { bookingNo: ID } })
  return ID
}
const incrementInvoiceNumber = async (invoiceId) => {
  const gererateInvoiceNumber = (lastInvoiceNumber) => {
    const prefix = 'DDD';
    let newCount = 1
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (lastInvoiceNumber) {
      const lastMonth = parseInt(lastInvoiceNumber.substring(3, 5)); // MM
      const lastYear = parseInt(lastInvoiceNumber.substring(5, 9)); // YYYY
      const lastCount = parseInt(lastInvoiceNumber.substring(9)); // ####
      newCount = (currentYear !== lastYear || currentMonth !== lastMonth) ? 1 : lastCount + 1;
    }
    const formattedMonth = String(currentMonth).padStart(2, '0');
    const formattedCount = String(newCount).padStart(4, '0');
    return `${prefix}${formattedMonth}${currentYear}${formattedCount}`;
  }
  const payment = await PaymentModel.find({ invoiceNo: { $exists: 1 } }).sort({ createdOn: -1 }).limit(1)
  const lastInvoiceNumber = payment[0]?.invoiceNo || null
  let ID = gererateInvoiceNumber(lastInvoiceNumber)
  const isExist = await PaymentModel.exists({ invoiceNo: ID })
  if (isExist)
    ID = gererateInvoiceNumber(lastInvoiceNumber)
  await PaymentModel.updateOne({ _id: invoiceId }, { $set: { invoiceNo: ID } })
  return ID

}

const generateInvoiceHTML = (bookingDetails) => {
  return `
<body style="font-family: Arial, sans-serif; max-width: 900px;font-size: 14px; margin: auto; border: 1px solid #ddd; padding: 10px;">
<div style="position:relative;">
<div style="display:flex;">
  <div style="flex: 1; background: #37858D; padding: 10px 20px;">
    <div style="display: flex;">
      <svg
        width="50"
        height="50"
        viewBox="0 0 322 322"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38.7677 56.0749C38.7677 56.0749 6.23041 96.227 1.38439 134.302L0 191.762C0 191.762 15.9225 245.067 32.5371 255.451L33.9216 160.609C33.9216 160.609 26.9989 113.534 58.1516 83.0738H183.454C183.454 83.0738 245.067 100.381 233.298 170.301C233.298 170.301 242.99 216.684 175.839 237.452L92.7655 235.375L92.0729 97.6116H74.7661L57.4587 123.918V267.22H188.992C188.992 267.22 247.143 256.143 269.296 182.07C269.296 182.07 281.065 74.7664 187.607 53.998L38.7677 56.0749Z"
          fill="url(#paint0_linear_748_663)"
        />
        <path
          d="M71.3047 287.296L190.377 287.988C190.377 287.988 262.374 271.373 289.372 195.915L319.833 193.838C319.833 193.838 314.295 262.374 237.452 304.603C237.452 304.603 139.148 352.37 71.3047 287.296Z"
          fill="url(#paint1_linear_748_663)"
        />
        <path
          d="M74.0742 31.1525L172.378 29.0757C172.378 29.0757 256.836 31.8449 290.758 125.302L321.218 127.379C321.218 127.379 292.142 17.9992 195.223 3.46138L135.687 0C135.687 0 82.3817 11.7687 74.0742 31.1525Z"
          fill="url(#paint2_linear_748_663)"
        />
        <path
          d="M154.738 108C154.738 108 106.101 113.791 131.188 164.543L155.933 202.523L180.337 163.692C180.337 163.692 206.618 116.345 154.738 108Z"
          fill="#F94141"
        />
        <path
          d="M169.091 112.028L132.5 166.555L144.741 185.361L177.606 168.12C177.97 168.846 203.365 127.382 169.091 112.028Z"
          fill="#C13535"
        />
        <path
          d="M155.079 156.88C162.996 156.88 169.414 150.475 169.414 142.574C169.414 134.673 162.996 128.268 155.079 128.268C147.162 128.268 140.744 134.673 140.744 142.574C140.744 150.475 147.162 156.88 155.079 156.88Z"
          fill="white"
        />
        <path
          d="M143.816 200.224C143.816 200.224 134.089 204.056 147.741 205.248C147.741 205.248 158.919 207.207 167.367 204.822C167.367 204.822 175.814 202.864 167.623 200.054C167.623 200.054 182.043 201.757 172.657 206.1C172.657 206.1 159.602 210.187 143.987 207.547C143.987 207.547 125.727 202.694 143.816 200.224Z"
          fill="#FF4F4F"
        />
        <path
          d="M137.076 200.224C137.076 200.224 125.215 203.8 134.686 207.377C134.686 207.377 155.421 213.423 172.743 208.739C172.743 208.739 188.614 205.077 173.937 200.224C173.937 200.224 196.379 203.374 181.958 210.698C181.958 210.698 168.903 215.381 146.547 213.593C146.547 213.593 107.211 208.228 137.076 200.224Z"
          fill="#FF3D3D"
        />
        <defs>
          <linearGradient
            id="paint0_linear_748_663"
            x1="237.256"
            y1="199.903"
            x2="0.107529"
            y2="208.136"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#2563A6" />
            <stop offset="1" stop-color="#E72C21" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_748_663"
            x1="289.877"
            y1="281.198"
            x2="71.7628"
            y2="292.849"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#2563A6" />
            <stop offset="1" stop-color="#E72C21" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_748_663"
            x1="291.428"
            y1="87.1637"
            x2="74.5257"
            y2="98.712"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#2563A6" />
            <stop offset="1" stop-color="#E72C21" />
          </linearGradient>
        </defs>
      </svg>
      <div style="color: white;">
        <p style="font-size: 28px; font-weight: 700; padding-left: 20px; margin: 0;">
          DDD Cabs
        </p>
        <p style="font-size: 18px; font-weight: 400; padding-left: 20px; margin: 0;">
          Freedom Rides
        </p>
      </div>
    </div>
  </div>
  <div style="flex: 1; text-align: end;">
    <p style="margin: 0 0 5px;">+91 (909) 040 4005</p>
    <p style="margin: 0 0 5px;">dddcabs@gmail.com</p>
    <p style="margin: 0 0 5px;">www.dddcabs.com</p>
  </div>
</div>
<div style="display:flex;">
  <div style="width: 60%">
    <h3 style="margin: 10px 0 8px; color: #37858D;">Bill To</h3>
    <p style="margin: 5px 0; display: flex;">
      <span style="display: inline; width: 180px;">Name</span>:
      <span style="padding-left: 10px;width:55%; word-wrap: normal;">${bookingDetails?.name}</span>
    </p>
    <p style="margin: 5px 0; display: flex;">
      <span style="display: inline; width: 180px;">Email</span>:
      <span style="padding-left: 10px;width:55%; word-wrap: normal;">${bookingDetails?.userId?.email}</span>
    </p>
    <p style="margin: 5px 0; display: flex;">
      <span style="display: inline; width: 180px;">Phone</span>:
      <span style="padding-left: 10px;width:55%; word-wrap: normal;">${bookingDetails?.userId?.primaryPhone}</span>
    </p>
  </div>
    

  <div style="width:40%">
    <div
      style="color: white; background: #37858D; padding: 5px; width: 200px; float: right; text-align: end; font-weight: 700;"
    >
      INVOICE
    </div>
    <p style="margin: 0; padding-top: 40px; text-align: end;">
      Invoice Number: #${bookingDetails?.paymentId?.invoiceNo}
    </p>
    <p style="margin: 0; text-align: end;">
      Invoice Date: ${getDateAndTimeString(bookingDetails?.pickupDate)}
    </p>
  </div>
</div>
<div style="margin-bottom: 20px;">
  <h3 style="margin: 10px 0 8px; color: #37858D;">Description</h3>

  <p style="margin: 5px 0; display: flex;">
    <span style="display: inline; width: 180px;">Vehicle Type</span>:
    <span style="padding-left: 10px;width:75%; word-wrap: normal;">${bookingDetails?.vehicleId?.vehicleType || 'N/A'}</span>
  </p>

  <p style="margin: 5px 0; display: flex;">
    <span style="display: inline; width: 180px;">Ride Type</span>:
    <span style="padding-left: 10px;width:75%; word-wrap: normal;">
      ${TRIP_TYPE?.find(li => li.value === bookingDetails?.trip?.tripType)?.name || 'N/A'}
    </span>
  </p>

  <p style="margin: 5px 0; display: flex;">
    <span style="display: inline; width: 180px;">Pickup Date & Time</span>:
    <span style="padding-left: 10px;width:75%; word-wrap: normal;">
      ${bookingDetails?.pickupDate?.date || 'DD'}/${bookingDetails?.pickupDate?.month || 'MM'}/${bookingDetails?.pickupDate?.year || 'YYYY'} 
      ${bookingDetails?.pickupTime || 'N/A'}
    </span>
  </p>

  <p style="margin: 5px 0; display: flex;";>
    <span style="display: inline; width: 180px;">Pickup Location</span>:
    <span style="padding-left: 10px; width:75%; word-wrap: normal;">${bookingDetails?.pickupLocation || 'N/A'}</span>
  </p>

  ${['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) ? `
    <p style="margin: 5px 0; display: flex;width: 100%;">
      <span style="display: inline; width: 180px;">Drop Location</span>:
      <span style="padding-left: 10px;width:75%; word-wrap: normal;">${bookingDetails?.dropoffLocation || 'N/A'}</span>
    </p>
  ` : ''}

  ${['roundTrip'].includes(bookingDetails?.trip?.tripType) ? `
    <p style="margin: 5px 0; display: flex;">
      <span style="display: inline; width: 180px;">Cities</span>:
      <span style="padding-left: 10px;width:75%; word-wrap: normal;">${bookingDetails?.pickUpCity?.name || 'N/A'}</span>
      ${bookingDetails?.dropCity?.map((item, index) => `
        <span key="${index}" style="padding-left: 10px;">${item.name}</span>
      `).join('')}
    </p>
  ` : ''}
</div>
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: right; background: #37858D; color: white;">
        Amount Description
      </th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: right; background: #37858D; color: white;">
        Distance ${['hourly'].includes(bookingDetails?.trip?.tripType) ? '/ Hour' : ['roundTrip'].includes(bookingDetails?.trip?.tripType) ? '/ Day' : ''}
      </th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: right; background: #37858D; color: white;">
        Subtotal
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 10px;">
        Fare
      </td>
      <td style="border: 1px solid #ddd; padding: 10px;">
        ${['hourly'].includes(bookingDetails?.trip?.tripType)
      ? `${bookingDetails?.paymentId?.totalDistance || '0'} Km || ${HOURLY_TYPE.find(li => li.value === bookingDetails?.trip?.hourlyType)?.label || 'N/A'} hr`
      : `${bookingDetails?.paymentId?.totalDistance || '0'} Km`}
      </td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">
        &#8377; ${bookingDetails?.paymentId?.totalPrice || 0}
      </td>
    </tr>
    ${bookingDetails?.paymentId?.extraAmount && bookingDetails?.paymentId?.extraAmount > 0 ? `
    <tr>
      <td style="border: 1px solid #ddd; padding: 10px;">Extra Fare</td>
      <td style="border: 1px solid #ddd; padding: 10px;">
        ${['hourly'].includes(bookingDetails?.trip?.tripType)
        ? `${bookingDetails?.paymentId?.extraDistance || 0} Km / ${bookingDetails?.paymentId?.extraHour || 0} hr`
        : ['roundTrip'].includes(bookingDetails?.trip?.tripType)
          ? `${bookingDetails?.paymentId?.extraDistance || 0} Km / ${bookingDetails?.paymentId?.extraDay || 0} Day`
          : `${bookingDetails?.paymentId?.extraDistance || 0} Km`}
      </td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">
        &#8377; ${bookingDetails?.paymentId?.extraAmount}
      </td>
    </tr>
    ` : ''}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        Total Amount
      </td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        &#8377; ${bookingDetails?.paymentId?.totalPrice + (bookingDetails?.paymentId?.extraAmount || 0)}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        Advance Amount
      </td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        &#8377; ${bookingDetails?.paymentId?.advancePercent
      ? ((bookingDetails?.paymentId?.totalPrice - (bookingDetails?.discountValue || 0)) * bookingDetails?.paymentId?.advancePercent / 100).toFixed(2)
      : 0}
      </td>
    </tr>
    ${bookingDetails?.paymentId?.couponCode ? `
    <tr>
      <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        Promo Discount
      </td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        &#8377; ${bookingDetails?.discountValue || 0}
      </td>
    </tr>
    ` : ''}
    <tr>
      <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        Due Amount
      </td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">
        &#8377; ${roundToDecimalPlaces(bookingDetails?.paymentId?.dueAmount || 0)}
      </td>
    </tr>
  </tfoot>
</table>
<div style="display: flex;">
  <div style="flex: 1;">
    <div style="margin-bottom: 20px;"></div>
    <h3 style="margin: 10px 0 8px; color: #37858D;">Notes</h3>
    <p style="margin: 5px 0; display: flex;">
      <span>
        Thank you for choosing DDD cabs for your car rental needs. If you have any questions regarding this invoice or need further assistance, please don't hesitate to contact us at +91 (909) 040 4005 or dddcabs@gmail.com
      </span>
    </p>
  </div>
  <div style="flex: 1; display: flex; align-items: end; justify-content: end;">
    <div style="text-align: end;">
      <p style="margin: 0 0 5px;">Date : September 11, 2024</p>
      <p style="margin: 0 0 5px; font-weight: 800; border-bottom: 2px solid black; padding: 10px 0;">
        Sign
      </p>
      <p style="margin: 0 0 5px;">DDD Cabs</p>
      <p style="margin: 0 0 5px;">Authorized Sign</p>
    </div>
  </div>
</div>

<div style="margin-top: 10px; text-align: center;">
  <p style="background: #37858D; margin: 0; padding: 10px; color: white;">
    Thank you for renting with <strong>DDD Cabs</strong>!
  </p>
</div>
<div style=" position: absolute;bottom: 5%;right: 27%;border:2px solid red; padding:14px;border-radius:50%;opacity:.5;transform: rotate(322deg);">
    <div style="display:flex; align-items:center; justify-content:center;font-size: 24px;font-weight: bold;color: red; border:2px solid red; padding:20px;border-radius:50%; width:50px; height:50px;">${bookingDetails?.isPaymentCompleted ? 'Paid' : 'Unpaid'}</div>
</div>

<div style="font-size: 86px;
    position: absolute;
    top: 40%;
    font-weight: bold;
    color: #ff000017;
    transform: rotate(316deg);
    left: 15%;">DDD CABS</div>
</div>
</body>

    `;
}

const getPdfFromHtml = async (html) => {
  try {
    let buffer;
    const browser = await puppeteer.launch({ headless: 'shell', args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
    buffer = await page.pdf({
      scale: 1.3,
      format: 'a4',
      printBackground: true,
      pageRanges: ''
    })
    await browser.close()
    return Buffer.from(buffer);

  } catch (error) {
    logger.log('getPdfOrImageBuffer', error);
    throw new Error(error);
  }
}




module.exports = { incrementBookingNumber, incrementInvoiceNumber, generateInvoiceHTML, getPdfFromHtml }