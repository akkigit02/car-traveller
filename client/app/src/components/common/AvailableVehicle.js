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
    <>
      <h2>Hoverable Table</h2>
      <p>Move the mouse over the table rows to see the effect.</p>

      <table>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Points</th>
        </tr>
        <tr>
          <td>Peter</td>
          <td>Griffin</td>
          <td>$100</td>
        </tr>
        <tr>
          <td>Lois</td>
          <td>Griffin</td>
          <td>$150</td>
        </tr>
        <tr>
          <td>Joe</td>
          <td>Swanson</td>
          <td>$300</td>
        </tr>
        <tr>
          <td>Cleveland</td>
          <td>Brown</td>
          <td>$250</td>
        </tr>
      </table>
    </>
  )
}
