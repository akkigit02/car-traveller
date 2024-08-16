import React, { useEffect, useRef } from 'react'
// import "https://apis.mappls.com/advancedmaps/api/edb1092ea3c5dd14cd34923f15ba6186/map_sdk?v=3.0&layer=vector";
export default function Demo() {
    const mapRef = useRef()
    // useEffect(() => {
    //     // Initialize the map once the component is mounted
    //     let map = new mappls.Map(mapRef.current, {center:{lat:28.612964,lng:77.229463} });
        
    //     console.log(map,"=====-------")
    //   }, []);

  return (
    <div>
      <h2>Demo</h2>
      <div ref={mapRef} style={{ width: '100%' }}>

      </div>
    </div>
  )
}
