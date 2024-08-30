import React, { useEffect, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';
function BookingHistory() {

  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(15)
  const [bookingList, setBookingList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [bookingDetails, setBookingDetails] = useState()
  const [isFetched, setIsFetched] = useState(false)
  const fetchBokkingHistory = async (isScroll) => {
    try {
      if (!isScroll)
        setSkip(0)
      setIsLoading(true)
      const { data } = await axios({
        url: '/api/client/booking',
        params: {
          skip: isScroll ? skip : 0,
          limit,
        }
      })
      console.log(data)
      setBookingList(data.list)
      setHasMore(data.list.length === limit);
      setSkip(old => old + limit);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getBookingById = async (bookingId) => {
    try {
      setIsFetched(true)
      const { data } = await axios({
        url: `/api/client/booking/${bookingId}`,
      })
      setBookingDetails(data.bookingData)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetched(false)
    }
  }





  useEffect(() => {
    fetchBokkingHistory()
  }, [])


  const getDateAndTimeString = (dateObj, time) => {
    return `${dateObj.date}/${dateObj.month}/${dateObj.year} ${time}`
  }


  return (
    <>
      <div>
        <InfiniteScroll
          dataLength={bookingList.length}
          next={() => fetchBokkingHistory(true)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more bookings to show.</p>}
        >
          <table >
            <thead>
              <tr>
                <th>Name</th>
                <th>Pick Up Date</th>
                <th>Booking Price</th>
                <th>Advance Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {isLoading ? <div>
              Loading
            </div> :
              <tbody>
                {bookingList.length ? bookingList?.map(item => (<tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{getDateAndTimeString(item.pickupDate, item.pickupTime)}</td>
                  <td>{item.totalPrice}</td>
                  <td>{item.advancePayment}</td>
                  <td>{item.bokkingStatus}</td>
                  <td>
                    <button onClick={() => getBookingById(item._id)} >view</button>
                    <button>reshduled</button>
                    <button>Cancel</button>
                  </td>
                </tr>))
                  :
                  <div>
                    No data
                  </div>
                }
              </tbody>}
          </table>
        </InfiniteScroll>





      </div>
    </>
  )
}

export default BookingHistory