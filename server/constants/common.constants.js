const DEVELOPER = [

]
const ADMIN = [

]
const DRIVER = [

]
const CLIENT = [

]

const CITY_CAB_PRICE = [
    {
      radiusRange: "00-09 KM",
      min: 0,
      max: 9,
      sedan: { base: 600, perKm: 25, min: 625, max: 825 },
      suv: { base: 800, perKm: 35, min: 835, max: 1115 }
    },
    {
      radiusRange: "10-19 KM",
      min: 10,
      max: 19,
      sedan: { base: 800, perKm: 20, min: 1000, max: 1380 },
      suv: { base: 1000, perKm: 25, min: 1250, max: 1475 }
    },
    {
      radiusRange: "20-29 KM",
      min: 20,
      max: 29,
      sedan: { base: 1200, perKm: 16, min: 1520, max: 1664 },
      suv: { base: 1300, perKm: 18, min: 1660, max: 1822 }
    },
    {
      radiusRange: "30-39 KM",
      min: 30,
      max: 39,
      sedan: { base: 1200, perKm: 16, min: 1680, max: 1824 },
      suv: { base: 1300, perKm: 18, min: 1840, max: 2002 }
    },
    {
      radiusRange: "40-49 KM",
      min: 40,
      max: 49,
      sedan: { base: 1200, perKm: 16, min: 1840, max: 1984 },
      suv: { base: 1300, perKm: 18, min: 2020, max: 2182 }
    },
    {
      radiusRange: "50-59 KM",
      min: 50,
      max: 59,
      sedan: { base: 1200, perKm: 16, min: 2000, max: 2144 },
      suv: { base: 1300, perKm: 18, min: 2200, max: 2362 }
    },
    {
      radiusRange: "60-69 KM",
      min: 60,
      max: 69,
      sedan: { base: 1200, perKm: 16, min: 2160, max: 2304 },
      suv: { base: 1300, perKm: 18, min: 2380, max: 2542 }
    },
    {
      radiusRange: "70-79 KM",
      min: 70,
      max: 79,
      sedan: { base: 1200, perKm: 16, min: 2320, max: 2464 },
      suv: { base: 1300, perKm: 18, min: 2560, max: 2722 }
    }
  ];
  


module.exports = {
    DEVELOPER,
    ADMIN,
    DRIVER,
    CLIENT,
    CITY_CAB_PRICE
}
