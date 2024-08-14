import { estimateRouteDistance } from "../utils/calculation.util";
import { log } from "../utils/logger.util";


const getCityCoordinates = async (cityName) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: cityName,
          format: 'json'
        }
      });
  
      if (response.data.length === 0) {
        throw new Error('City not found');
      }
  
      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      log('getCityCoordinates', error)
      return null;
    }
  };

const getDistanceOfTwoCities = async(from, to) => {
    try {
        const start = await getCityCoordinates(from);
        const end = await getCityCoordinates(to);
        const distance = estimateRouteDistance(start.lat, start.lon, end.lat, end.lon)
        return distance;
    } catch (error) {
       console.log(error) 
    }
}

// const getLocalAddresses = async (lat, lon, searchTerm) => {
//   try {
//     const query = `
//       [out:json];
//       (
//         node["addr:street"](around:5000, ${lat}, ${lon});
//         way["addr:street"](around:5000, ${lat}, ${lon});
//         relation["addr:street"](around:5000, ${lat}, ${lon});
//       );
//       out body;
//       >;
//       out skel qt;
//     `;

//     const response = await axios.get('https://overpass-api.de/api/interpreter', {
//       params: { data: query }
//     });

//     const addresses = response.data.elements.map(element => ({
//       id: element.id,
//       type: element.type,
//       lat: element.lat || (element.center && element.center.lat),
//       lon: element.lon || (element.center && element.center.lon),
//       tags: element.tags
//     }));

//     // Filter addresses based on the search term
//     const filteredAddresses = addresses.filter(address => {
//       if (!address.tags) return false;
//       const addressString = JSON.stringify(address.tags).toLowerCase();
//       return addressString.includes(searchTerm.toLowerCase());
//     });

//     return filteredAddresses;
//   } catch (error) {
//     console.error('Error fetching local addresses:', error);
//     return [];
//   }
// };

// // Main function to get local addresses for a given city
// const getCityLocalAddresses = async (cityName, searchTerm) => {
//   const coordinates = await getCityCoordinates(cityName);

//   if (coordinates) {
//     const localAddresses = await getLocalAddresses(coordinates.lat, coordinates.lon, searchTerm);
//     console.log(localAddresses);
//   }
// };


module.exports = {
    getDistanceOfTwoCities,
}