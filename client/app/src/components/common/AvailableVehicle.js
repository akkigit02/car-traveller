import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams, } from 'react-router-dom';

export default function AvailableVehicle() {
  const { query } = useParams();


  const getCarList = async () => {
    try {
      const { data } = await axios({
        url: '/api/client/car-list',
        params: { search: query }
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (query) {
      getCarList()
    }

  }, [])

  return (
    <div>
      Choose Available
    </div>
  )
}
