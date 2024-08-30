import React, { useEffect, useState } from 'react'
import axios from 'axios'

function BookingHistory() {

  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(15)
  const [bookingList, setBookingList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const fetchBokkingHistory = async (isNext) => {
    try {
      setIsLoading(true)
      const { data } = await axios({
        url: '/api/client/booking',
        params: {
          skip: isNext ? skip : 0,
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

  useEffect(()=>{
    fetchBokkingHistory()
  },[])

  return (
    <>
      {/* <div>BookingHistory</div> */}

    



    </>
  )
}

export default BookingHistory