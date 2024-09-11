const USER_ROUTE = {
  ADMIN: "/admin",
  DRIVER: "/driver",
  CLINET: "/client",
  DEVELOPER: "/developer",
};

const VEHICLE_TYPE = [
  {
    name: "Hatchback",
    value: "Hatchback",
  },
  {
    name: "SUV",
    value: "SUV",
  },
  {
    name: "Luxury Sedan",
    value: "luxury_sedan",
  },
  {
    name: "Sedan",
    value: "Sedan",
  },
  {
    name: "Innova",
    value: "Innova",
  },
  {
    name: "Innova Crysta",
    value: "Innova_Crysta",
  },
  {
    name: "Traveller",
    value: "Traveller",
  },
  {
    name: "Economy",
    value: "economy",
  },
  {
    name: "Compact",
    value: "compact",
  },
  {
    name: "Van",
    value: "van",
  },
  {
    name: "Pickup Truck",
    value: "pickup_truck",
  },
  {
    name: "Minivan",
    value: "minivan",
  },
  {
    name: "Electric",
    value: "electric",
  },
  {
    name: "Hybrid",
    value: "hybrid",
  },
  {
    name: "Luxury SUV",
    value: "luxury_suv",
  },
];

const FUEL_TYPE = [
  {
    name: "Petrol",
    value: "petrol",
  },
  {
    name: "Diesel",
    value: "diesel",
  },
  {
    name: "CNG",
    value: "cng",
  },
][("oneWay", "local", "roundTrip", "airport")];
const TRIP_TYPE = [
  {
    name: "One Way",
    value: "oneWay",
  },
  {
    name: "Hourly",
    value: "hourly",
  },
  {
    value: "roundTrip",
    name: "Round Trip",
  },
  {
    value: "cityCab",
    name: "City Cab",
  },
];

const HOURLY_TYPE = [
  {
    name: "8 Hours| 80 Km",
    value: "8hr80km",
  },
  {
    name: "10 Hours| 100 Km",
    value: "10hr100km",
  },
  {
    name: "12 Hours| 120 Km",
    value: "12hr120km",
  },
];

const MONTH_NAME = [
  { month: "01", name: "Jan" },
  { month: "02", name: "Feb" },
  { month: "03", name: "March" },
  { month: "04", name: "April" },
  { month: "05", name: "May" },
  { month: "06", name: "June" },
  { month: "07", name: "July" },
  { month: "08", name: "Aug" },
  { month: "09", name: "Sept" },
  { month: "10", name: "Oct" },
  { month: "11", name: "Nov" },
  { month: "12", name: "Dec" }
];

module.exports = {
  USER_ROUTE,
  VEHICLE_TYPE,
  FUEL_TYPE,
  TRIP_TYPE,
  HOURLY_TYPE,
  MONTH_NAME
};
