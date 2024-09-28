const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Ride = require("../models/ride.model");
const dbName = process.env.DB_NAME;

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
  insertRidesInBatches();
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

const rideStatuses = [
  "none",
  "scheduled",
  "completed",
  "cancelled",
  "resheduled",
  "booked"
];

const generateRide = () => {
  return {
    name: faker.company.name(),
    bookingNo: faker.string.uuid(),
    driverId: new mongoose.Types.ObjectId(),
    vehicleId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    pickUpCity: new mongoose.Types.ObjectId(),
    dropCity: [new mongoose.Types.ObjectId()],
    pickupLocation: faker.location.streetAddress(),
    dropoffLocation: faker.location.streetAddress(),
    pickupDate: {
      date: faker.date.past().getDate(),
      month: faker.date.past().getMonth() + 1,
      year: faker.date.past().getFullYear(),
    },
    pickupTime: faker.date.recent().toISOString().substring(11, 16),
    dropDate: {
      date: faker.date.future().getDate(),
      month: faker.date.future().getMonth() + 1,
      year: faker.date.future().getFullYear(),
    },
    totalPrice: parseFloat(faker.commerce.price()),
    totalDistance: faker.number.int({ min: 1, max: 100 }),
    isInvoiceGenerate: faker.datatype.boolean(),
    paymentId: new mongoose.Types.ObjectId(),
    trip: {
      tripType: faker.helpers.arrayElement(["single", "round-trip"]),
      hourlyType: faker.helpers.arrayElement(["standard", "premium"]),
    },
    isLaguageCarrier: faker.datatype.boolean(),
    rideStatus: faker.helpers.arrayElement(rideStatuses),
    reason: faker.lorem.sentence(),
    isConnected: faker.datatype.boolean(),
    activity: [],
    source: faker.lorem.word(),
  };
};

const insertRidesInBatches = async () => {
  const batchSize = 100;
  const totalRides = 1500;
  const rides = Array.from({ length: totalRides }, generateRide);

  try {
    for (let i = 0; i < totalRides; i += batchSize) {
      const batch = rides.slice(i, i + batchSize);
      await Ride.insertMany(batch);
      console.log(`Successfully inserted batch ${i / batchSize + 1}`);
    }
    console.log("Successfully inserted all ride records.");
  } catch (error) {
    console.error("Error inserting ride records:", error);
  }
};
