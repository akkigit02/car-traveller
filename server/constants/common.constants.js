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
      hatchback: { base: 600, perKm: 20, min: 620, max: 780 },
      sedan: { base: 600, perKm: 25, min: 625, max: 825 },
      suv: { base: 800, perKm: 35, min: 835, max: 1115 }
    },
    {
      radiusRange: "10-19 KM",
      min: 9,
      max: 19,
      hatchback: { base: 800, perKm: 15, min: 950, max: 1085 },
      sedan: { base: 800, perKm: 20, min: 1000, max: 1380 },
      suv: { base: 1000, perKm: 25, min: 1250, max: 1475 }
    },
    {
      radiusRange: "20-29 KM",
      min: 19,
      max: 29,
      hatchback: { base: 1000, perKm: 16, min: 1016, max: 1464 },
      sedan: { base: 1200, perKm: 16, min: 1520, max: 1664 },
      suv: { base: 1300, perKm: 18, min: 1660, max: 1822 }
    },
    {
      radiusRange: "30-39 KM",
      min: 29,
      max: 39,
      hatchback: { base: 1100, perKm: 16, min: 1580, max: 1724 },
      sedan: { base: 1200, perKm: 16, min: 1680, max: 1824 },
      suv: { base: 1300, perKm: 18, min: 1840, max: 2002 }
    },
    {
      radiusRange: "40-49 KM",
      min: 39,
      max: 49,
      hatchback: { base: 1100, perKm: 16, min: 1740, max: 1884 },
      sedan: { base: 1200, perKm: 16, min: 1840, max: 1984 },
      suv: { base: 1300, perKm: 18, min: 2020, max: 2182 }
    },
    {
      radiusRange: "50-59 KM",
      min: 49,
      max: 59,
      hatchback: { base: 1100, perKm: 16, min: 1900, max: 2044 },
      sedan: { base: 1200, perKm: 16, min: 2000, max: 2144 },
      suv: { base: 1300, perKm: 18, min: 2200, max: 2362 }
    },
    {
      radiusRange: "60-69 KM",
      min: 59,
      max: 69,
      hatchback: { base: 1100, perKm: 16, min: 2060, max: 2204 },
      sedan: { base: 1200, perKm: 16, min: 2160, max: 2304 },
      suv: { base: 1300, perKm: 18, min: 2380, max: 2542 }
    },
    {
      radiusRange: "70-79 KM",
      min: 69,
      max: 500,
      hatchback: { base: 1100, perKm: 16, min: 2220, max: 2364 },
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
