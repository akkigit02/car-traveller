import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { MONTH_NAME } from "../../constants/common.constants";

const Dashboard = () => {
  // Data for the pie charts
  const [rideCount, setRideCount] = useState([0, 0, 0])
  const [revenues, setRevenues] = useState({
    series: [{ name: "Revenue", data: [] }],
    options: { chart: { type: "bar" }, xaxis: { categories: [] } }
  })
  const [carTypeRevenue, setCarTypeRevenue] = useState({
    series: [{ name: "Revenue", data: [] }],
    options: { chart: { type: "bar" }, xaxis: { categories: [] } }
  })
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()))
  const [yearCarFilter, setYearCarFilter] = useState(String(new Date().getFullYear()))
  const [bookingList, setBookingList] = useState([])
  const [lead, setLead] = useState([])

  const getBookingList = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/admin/booking-count',
      })
      setRideCount([data.rideCounts.upcomingRides, data.rideCounts.todayRides, data.rideCounts.pastRides])
    } catch (error) {
      console.log(error)
    }
  }

  const getBookingRevenue = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/admin/booking-revenue',
        params: {
          year: yearFilter
        }
      })
      setRevenues({
        series: [{ name: "Revenue", data: data.revenue }],
        options: { chart: { type: "bar" }, xaxis: { categories: data.monthly } }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getBookingRevenueByCar = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/admin/car-revenue',
        params: {
          year: '2024'
        }
      })
      setCarTypeRevenue({
        series: [{ name: "Revenue", data: data.revenue }],
        options: { chart: { type: "bar" }, xaxis: { categories: data.carTypes } }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getRecentBooking = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/admin/recent-booking'
      })
      setBookingList(data?.rideBooking)
    } catch (error) {
      console.error(error)
    }
  }

  const getRecentLead = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/admin/recent-lead'
      })
      setLead(data?.rideBooking)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getBookingRevenueByCar()
  }, [yearCarFilter])

  useEffect(() => {
    getRecentBooking()
    getBookingList()
    getRecentLead()
  }, [])
  useEffect(() => {
    getBookingRevenue()
  }, [yearFilter])

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Booking */}
        <div className="chart-container">
          <Chart options={{ labels: ["Upcoming", "Today", "Past"] }} series={rideCount} type="pie" width="100%" />
        </div>

        <div className="chart-container">
          <div>
            <select className="select-input" name="year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              {Array.from({ length: 15 }, (_, i) => (<option value={((new Date().getFullYear() + 1) - i)} key={"year" + i}>{((new Date().getFullYear() + 1) - i)}</option>))}
            </select>
          </div>
          <Chart options={revenues.options} series={revenues.series} type="bar" height={250} />
        </div>

        <div className="chart-container">
          <div>
            <select className="select-input" name="year" value={yearCarFilter} onChange={(e) => setYearCarFilter(e.target.value)}>
              {Array.from({ length: 15 }, (_, i) => (<option value={((new Date().getFullYear() + 1) - i)} key={i}>{((new Date().getFullYear() + 1) - i)}</option>))}
            </select>
          </div>
          <Chart options={carTypeRevenue.options} series={carTypeRevenue.series} type="bar" height={250} />
        </div>

        {/* Table */}
      </div>
      <div className="table-grid">
      <div className="table-container">
        Client
        <table className="cstm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pickup Date</th>
              <th>Vehicle Type</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bookingList.length > 0 ? bookingList.map((row, i) => (
              <tr key={"new" + i}>
                <td>{row?.userId?.name}</td>
                <td>{`${row?.pickupDate?.date}/${row?.pickupDate?.month}/${row?.pickupDate?.year}`}</td>
                <td>{row?.vehicleId?.vehicleType}</td>
                <td>{row.totalPrice}</td>
              </tr>
            )) :
              <tr className='no-data'>
                <td colspan="100%">
                  <div className='d-flex align-items-center justify-content-center'><div className='no-data-content'></div></div>
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
        <div className="table-container">
          Lead
          <table className="cstm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Pickup Date</th>
                <th>Vehicle Type</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {lead.map((row, i) => (
                <tr key={"new" + i}>
                  <td>{row?.userId?.name}</td>
                  <td>{`${row?.pickupDate?.date}/${row?.pickupDate?.month}/${row?.pickupDate?.year}`}</td>
                  <td>{row?.vehicleId?.vehicleType}</td>
                  <td>{row.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

