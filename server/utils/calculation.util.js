
function haversine(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    const toRadians = angle => (angle * Math.PI) / 180;
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);
  
    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
  
    // Radius of Earth in kilometers
    const R = 6371;
    // Calculate the straight-line distance
    const distance = R * c;
  
    return distance;
  }
  
  function estimateRouteDistance(lat1, lon1, lat2, lon2, adjustmentFactor = 1.2) {
    // Calculate the Haversine distance
    const straightLineDistance = haversine(lat1, lon1, lat2, lon2);
    // Apply the adjustment factor to estimate route distance
    const estimatedRouteDistance = straightLineDistance * adjustmentFactor;
    return estimatedRouteDistance;
  }

  const dateDifference = (startDate, endDate) => {
    // Parse the dates in the format "DD-MM-YYYY"
    const start = new Date(startDate.split('-').reverse().join('-'));
    const end = new Date(endDate.split('-').reverse().join('-'));
  
    // Calculate the difference in time
    const timeDiff = end - start;
  
    // Convert time difference from milliseconds to days
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
  
    return dayDiff;
  }


  module.exports = {
    estimateRouteDistance,
    dateDifference
  }