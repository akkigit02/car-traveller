import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VehiclePricing() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getBookingList();
  }, []);

  const getBookingList = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/admin/booking",
      });

      setList(res.data.ride);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title" >Booking Detail</p>
        </div>
      </div>
      <table className="cstm-table">
        <thead>
          <tr>
            <th>Passanger Name</th>
            <th>Pickup Date</th>
            <th>Pickup Time</th>
            <th>Drop Date</th>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
            <th>Total Distance</th>
            <th>Total Price</th>
            <th>Advance Payment</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((li, index) => (
            <tr key={index}>
              <td>{li.user.firstName+' '+(li?.user?.lastName ? li?.user?.lastName : '')}</td>
              <td>{li.pickupDate}</td>
              <td>{li.pickupTime}</td>
              <td>{li.dropDate}</td>
              <td>{li.totalDistance}</td>
              <td>{li.totalPrice}</td>
              <td>{li.advancePayment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
