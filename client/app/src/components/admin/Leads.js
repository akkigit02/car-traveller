import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Leads() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/leads");
      setList(res.data.leads);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCall = async (leadId) => {
    const confirmAction = window.confirm("Do you want to confirm the call?");
    if (confirmAction) {
      try {
        const { data } = await axios.put(`/api/admin/leads/${leadId}`);
        toast.success(data.message);
        setList((prevList) =>
          prevList.map((lead) =>
            lead._id === leadId ? { ...lead, isConnected: true } : lead
          )
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to confirm call");
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">Leads</p>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
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
              <th>Called</th>
              <th>Action</th>
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
                    {lead?.createdOn ? lead.createdOn.slice(0, 10) : "N/A"}
                  </td>
                  <td
                    style={{
                      backgroundColor: lead?.isConnected ? "green" : "red",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {lead?.isConnected ? "Yes" : "No" || "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => confirmCall(lead._id)}
                      disabled={lead?.isConnected}
                    >
                      {lead?.isConnected ? "Called" : "Confirm Call"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No leads found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
