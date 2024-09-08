import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leads() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/admin/leads",
      });
      console.log(res.data.leads)
      setList(res.data.leads);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">Leads</p>
        </div>
      </div>
      <table className="cstm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>PickUpCity</th>
            <th>DropCity</th>
            <th>PickUpDate</th>
            <th>Requested At</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((lead, index) => (
              <tr key={index}>
                <td>{lead?.name || "N/A"}</td>
                <td>{lead?.userId?.email || "N/A"}</td>
                <td>{lead?.userId?.primaryPhone || "N/A"}</td>
                <td>{lead?.pickUpCity?.name || "N/A"}</td>
                <td>
                  {lead?.dropCity?.length > 0 
                    ? lead.dropCity.map((element, index) => (
                        <span key={index}>
                          {element.name}
                          {index < lead.dropCity.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "N/A"}
                </td>
                <td>
                  {lead?.pickupDate 
                    ? `${lead.pickupDate.date}-${lead.pickupDate.month}-${lead.pickupDate.year}` 
                    : "N/A"}
                </td>
                <td>
                {lead?.createdOn 
                  ? lead.createdOn.slice(0, 10)  // Extracts the YYYY-MM-DD part
                  : "N/A"}
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No leads found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
