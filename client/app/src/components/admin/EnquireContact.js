import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function EnquireContact() {

    const [list, setList] = useState([]);

    useEffect(() => {
        getEnquireContactList();
    }, []);
  
    const getEnquireContactList = async () => {
      try {
        const res = await axios({
          method: "get",
          url: "/api/admin/enquire-contact",
        });
        console.log(res.data.contacts)
        setList(res.data.contacts);
      } catch (error) {
        console.error(error);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title" >Contact Enquiry</p>
        </div>
      </div>
      <table className="cstm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Contact Date</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ?  list?.map((li, index) => (
            <tr key={index}>
              <td>{li.name}</td>
              <td>{li.email}</td>
              <td>{li.phone}</td>
              <td>{li.message}</td>
              <td>{formatDate(li.date)}</td>
            </tr>
          ))
            :
          <tr className='no-data'>
            <td colspan="100%">
              <div className='d-flex align-items-center justify-content-center'><div  className='no-data-content'></div></div>
            </td>
          </tr>
          
          }
        </tbody>
      </table>
    </div>
  )
}
