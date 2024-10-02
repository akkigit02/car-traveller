import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationModal from "../common/ConfirmationModal"

export default function Leads() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

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

  const confirmCall = async () => {
      try {
        const { data } = await axios.put(`/api/admin/leads/${selectedId}`);
        toast.success(data.message);
        setList((prevList) =>
          prevList.map((lead) =>
            lead._id === selectedId ? { ...lead, isConnected: true } : lead
          )
        );
        setSelectedId(null)
      } catch (error) {
        console.error(error);
        toast.error("Failed to confirm call");
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
              <th>Booking Id</th>
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
                  <td>#{lead?.bookingNo || "N/A"}</td>
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
                      color: lead?.isConnected ? "green" : "red",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {lead?.isConnected ? "Yes" : "No" || "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {setSelectedId(lead._id); setConfirmationOpen(true)}}
                      disabled={lead?.isConnected}
                    >
                      {lead?.isConnected ? "Called" : "Confirm Call"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='no-data'>
                <td colspan="100%">
                  <div className='d-flex align-items-center justify-content-center'><div className='no-data-content'></div></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmCall}
        message="Are you sure you want to confirm the call?"
      />
    </div>
  );
}
