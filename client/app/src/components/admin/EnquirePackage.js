import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function EnquirePackage() {

    const [list, setList] = useState([]);

    useEffect(() => {
        getEnquirePackageList();
    }, []);
  
    const getEnquirePackageList = async () => {
      try {
        const res = await axios({
          method: "get",
          url: "/api/admin/enquire-package",
        });
        console.log(res.data.packages)
        setList(res.data.packages);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title" >Enquire Packages</p>
        </div>
      </div>
      <table className="cstm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Package</th>
            <th>Journey Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ?  list?.map((li, index) => (
            <tr key={index}>
              <td>{li.name}</td>
              <td>{li.email}</td>
              <td>{li.phone}</td>
              <td>{li.package}</td>
              <td>{li.date}</td>
              <td>---</td>
            </tr>
          ))
            :
          // <tr className='no-data'><div className='no-data-content'>sdd</div></tr>
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
