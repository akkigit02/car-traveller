import { useEffect, useState } from "react";
import { TRIP_TYPE } from "../../constants/common.constants";
import axios from 'axios'


const Invoice = ({ bookingId }) => {

    const [bookingDetails, setBookingDetails] = useState({})

    const getInvoiceInfo = async () => {
        try {
            const { data } = await axios({
                method: 'GET',
                url: '/api/client/invoice/' + bookingId
            })
            setBookingDetails(data?.bookingDetails)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getInvoiceInfo()
    }, [])


    return (
        <>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1, background: "#37858D", padding: 20 }}>
                    <div style={{ display: "flex" }}>
                        <svg
                            width={50}
                            height={50}
                            viewBox="0 0 322 322"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M38.7677 56.0749C38.7677 56.0749 6.23041 96.227 1.38439 134.302L0 191.762C0 191.762 15.9225 245.067 32.5371 255.451L33.9216 160.609C33.9216 160.609 26.9989 113.534 58.1516 83.0738H183.454C183.454 83.0738 245.067 100.381 233.298 170.301C233.298 170.301 242.99 216.684 175.839 237.452L92.7655 235.375L92.0729 97.6116H74.7661L57.4587 123.918V267.22H188.992C188.992 267.22 247.143 256.143 269.296 182.07C269.296 182.07 281.065 74.7664 187.607 53.998L38.7677 56.0749Z"
                                fill="url(#paint0_linear_748_663)"
                            />
                            <path
                                d="M71.3047 287.296L190.377 287.988C190.377 287.988 262.374 271.373 289.372 195.915L319.833 193.838C319.833 193.838 314.295 262.374 237.452 304.603C237.452 304.603 139.148 352.37 71.3047 287.296Z"
                                fill="url(#paint1_linear_748_663)"
                            />
                            <path
                                d="M74.0742 31.1525L172.378 29.0757C172.378 29.0757 256.836 31.8449 290.758 125.302L321.218 127.379C321.218 127.379 292.142 17.9992 195.223 3.46138L135.687 0C135.687 0 82.3817 11.7687 74.0742 31.1525Z"
                                fill="url(#paint2_linear_748_663)"
                            />
                            <path
                                d="M154.738 108C154.738 108 106.101 113.791 131.188 164.543L155.933 202.523L180.337 163.692C180.337 163.692 206.618 116.345 154.738 108Z"
                                fill="#F94141"
                            />
                            <path
                                d="M169.091 112.028L132.5 166.555L144.741 185.361L177.606 168.12C177.97 168.846 203.365 127.382 169.091 112.028Z"
                                fill="#C13535"
                            />
                            <path
                                d="M155.079 156.88C162.996 156.88 169.414 150.475 169.414 142.574C169.414 134.673 162.996 128.268 155.079 128.268C147.162 128.268 140.744 134.673 140.744 142.574C140.744 150.475 147.162 156.88 155.079 156.88Z"
                                fill="white"
                            />
                            <path
                                d="M143.816 200.224C143.816 200.224 134.089 204.056 147.741 205.248C147.741 205.248 158.919 207.207 167.367 204.822C167.367 204.822 175.814 202.864 167.623 200.054C167.623 200.054 182.043 201.757 172.657 206.1C172.657 206.1 159.602 210.187 143.987 207.547C143.987 207.547 125.727 202.694 143.816 200.224Z"
                                fill="#FF4F4F"
                            />
                            <path
                                d="M137.076 200.224C137.076 200.224 125.215 203.8 134.686 207.377C134.686 207.377 155.421 213.423 172.743 208.739C172.743 208.739 188.614 205.077 173.937 200.224C173.937 200.224 196.379 203.374 181.958 210.698C181.958 210.698 168.903 215.381 146.547 213.593C146.547 213.593 107.211 208.228 137.076 200.224Z"
                                fill="#FF3D3D"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_748_663"
                                    x1="237.256"
                                    y1="199.903"
                                    x2="0.107529"
                                    y2="208.136"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#2563A6" />
                                    <stop offset={1} stopColor="#E72C21" />
                                </linearGradient>
                                <linearGradient
                                    id="paint1_linear_748_663"
                                    x1="289.877"
                                    y1="281.198"
                                    x2="71.7628"
                                    y2="292.849"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#2563A6" />
                                    <stop offset={1} stopColor="#E72C21" />
                                </linearGradient>
                                <linearGradient
                                    id="paint2_linear_748_663"
                                    x1="291.428"
                                    y1="87.1637"
                                    x2="74.5257"
                                    y2="98.712"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#2563A6" />
                                    <stop offset={1} stopColor="#E72C21" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{ color: "white" }}>
                            <p
                                style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    paddingLeft: 20,
                                    margin: 0
                                }}
                            >
                                DDD Cabs
                            </p>
                            <p
                                style={{
                                    fontSize: 18,
                                    fontWeight: 400,
                                    paddingLeft: 20,
                                    margin: 0
                                }}
                            >
                                Freedom Rides
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, textAlign: "end" }}>
                    <p style={{ margin: "0 0 5px" }}> +91 (909) 040 4005</p>
                    <p style={{ margin: "0 0 5px" }}>dddcabs@gmail.com</p>
                    <p style={{ margin: "0 0 5px" }}>www.dddcabs.com</p>
                </div>
            </div>
            {/* <p style="text-align: right; color: #888;">Date: <strong>2024-09-09</strong></p> */}
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "10px 0 8px", color: "#37858D" }}>Bill To</h3>
                    <p style={{ margin: "5px 0", display: "flex" }}>
                        <span style={{ display: "inline", width: 100 }}>Name</span>:
                        <span style={{ paddingLeft: 10 }}>{bookingDetails?.name}</span>
                    </p>
                    {/* <p style={{ margin: "5px 0", display: "flex" }}>
                        <span style={{ display: "inline", width: 100 }}>Address</span>:
                        <span style={{ paddingLeft: 10 }}>NA</span>
                    </p> */}
                    <p style={{ margin: "5px 0", display: "flex" }}>
                        <span style={{ display: "inline", width: 100 }}>Email</span>:
                        <span style={{ paddingLeft: 10 }}>{bookingDetails?.userId?.email}</span>
                    </p>
                    <p style={{ margin: "5px 0", display: "flex" }}>
                        <span style={{ display: "inline", width: 100 }}>Phone</span>:
                        <span style={{ paddingLeft: 10 }}>{bookingDetails?.userId?.primaryPhone}</span>
                    </p>
                </div>
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            color: "white",
                            background: "#37858D",
                            padding: 5,
                            width: 200,
                            float: "right",
                            textAlign: "end",
                            fontWeight: 700
                        }}
                    >
                        INVOICE
                    </div>
                    <p style={{ margin: 0, paddingTop: 40, textAlign: "end" }}>
                        {" "}
                        Invoice Number : INV2024
                    </p>
                    <p style={{ margin: 0, textAlign: "end" }}> Invoice Date : 10-10-2024</p>
                </div>
            </div>
            <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: "10px 0 8px", color: "#37858D" }}>
                    Description
                </h3>
                <p style={{ margin: "5px 0", display: "flex" }}>
                    <span style={{ display: "inline", width: 100 }}>Vehicle Type</span>:
                    <span style={{ paddingLeft: 10 }}>{bookingDetails?.vehicleId?.vehicleType}</span>
                </p>
                <p style={{ margin: "5px 0", display: "flex" }}>
                    <span style={{ display: "inline", width: 100 }}>Ride Type</span>:
                    <span style={{ paddingLeft: 10 }}>{TRIP_TYPE?.find(li => li.value === bookingDetails?.trip?.tripType)?.name}</span>
                </p>
                <p style={{ margin: "5px 0", display: "flex" }}>
                    <span style={{ display: "inline", width: 100 }}>Pickup Date & Time</span>:
                    <span style={{ paddingLeft: 10 }}>{`${bookingDetails?.pickupDate?.date}/${bookingDetails?.pickupDate?.month}/${bookingDetails?.pickupDate?.year} `} {bookingDetails?.pickupTime}</span>
                </p>
                <p style={{ margin: "5px 0", display: "flex" }}>
                    <span style={{ display: "inline", width: 100 }}>Pickup Location</span>:
                    <span style={{ paddingLeft: 10 }}>{bookingDetails?.pickupLocation}</span>
                </p>

                {['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) && <>
                    <p style={{ margin: "5px 0", display: "flex" }}>
                        <span style={{ display: "inline", width: 100 }}>Drop Location</span>:
                        <span style={{ paddingLeft: 10 }}>{bookingDetails?.dropoffLocation}</span>
                    </p>
                </>}
                {['roundTrip'].includes(bookingDetails?.trip?.tripType) && <>
                    <p style={{ margin: "5px 0", display: "flex" }}>
                        <span style={{ display: "inline", width: 100 }}>Cities</span>:
                        <span style={{ paddingLeft: 10 }}>
                            {bookingDetails?.pickUpCity?.name}
                        </span>
                        {bookingDetails?.dropCity?.map((item, index) => (
                            <span key={index} style={{ paddingLeft: 10 }}>
                                {item.name}
                            </span>
                        ))}
                    </p>
                </>}

            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "left",
                                background: "#37858D",
                                color: "white"
                            }}
                        >
                            Description
                        </th>
                        <th
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "left",
                                background: "#37858D",
                                color: "white"
                            }}
                        >
                            Rental Period
                        </th>
                        <th
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "right",
                                background: "#37858D",
                                color: "white"
                            }}
                        >
                            Rate/KM
                        </th>
                        <th
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "right",
                                background: "#37858D",
                                color: "white"
                            }}
                        >
                            Number of Days
                        </th>
                        <th
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "right",
                                background: "#37858D",
                                color: "white"
                            }}
                        >
                            Subtotal
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: 10 }}>WagonR</td>
                        <td style={{ border: "1px solid #ddd", padding: 10 }}>
                            2024-09-01 to 2024-09-04
                        </td>
                        <td
                            style={{ border: "1px solid #ddd", padding: 10, textAlign: "right" }}
                        >
                            15/km
                        </td>
                        <td
                            style={{ border: "1px solid #ddd", padding: 10, textAlign: "right" }}
                        >
                            3
                        </td>
                        <td
                            style={{ border: "1px solid #ddd", padding: 10, textAlign: "right" }}
                        >
                            90
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: 10 }}>Swift</td>
                        <td style={{ border: "1px solid #ddd", padding: 10 }}>
                            2024-09-01 to 2024-09-03
                        </td>
                        <td
                            style={{ border: "1px solid #ddd", padding: 10, textAlign: "right" }}
                        >
                            20/km
                        </td>
                        <td
                            style={{ border: "1px solid #ddd", padding: 10, textAlign: "right" }}
                        >
                            2
                        </td>
                        <td
                            style={{ border: "1px solid #ddd", padding: 10, textAlign: "right" }}
                        >
                            72
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td
                            colSpan={4}
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "right",
                                fontWeight: "bold"
                            }}
                        >
                            Total
                        </td>
                        <td
                            style={{
                                border: "1px solid #ddd",
                                padding: 10,
                                textAlign: "right",
                                fontWeight: "bold"
                            }}
                        >
                            162
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 20 }}>
                        <h3 style={{ margin: "10px 0 8px", color: "#37858D" }}>
                            Payment Information
                        </h3>
                        <p style={{ margin: "5px 0", display: "flex" }}>
                            <span style={{ display: "inline", width: 200 }}>
                                Payment Due Date
                            </span>
                            :<span style={{ paddingLeft: 10 }}>September 11, 2024</span>
                        </p>
                        <p style={{ margin: "5px 0", display: "flex" }}>
                            <span style={{ display: "inline", width: 200 }}>Bank Name</span>:
                            <span style={{ paddingLeft: 10 }}>Bank of Boroda</span>
                        </p>
                        <p style={{ margin: "5px 0", display: "flex" }}>
                            <span style={{ display: "inline", width: 200 }}>Account Name</span>:
                            <span style={{ paddingLeft: 10 }}>john</span>
                        </p>
                        <p style={{ margin: "5px 0", display: "flex" }}>
                            <span style={{ display: "inline", width: 200 }}>Account Number</span>:
                            <span style={{ paddingLeft: 10 }}>76543219087</span>
                        </p>
                    </div>
                    <div style={{ marginBottom: 20 }} />
                    <h3 style={{ margin: "10px 0 8px", color: "#37858D" }}>Notes</h3>
                    <p style={{ margin: "5px 0", display: "flex" }}>
                        <span>
                            Thank you for choosing DDD cabs for your car rental needs. If you have
                            any quetions regarding this invoice or need further assistance, Please
                            don't hesitate to contact us at +91 (909) 040 4005 or
                            dddcabs@gmail.com
                        </span>
                    </p>
                </div>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "end"
                    }}
                >
                    <div style={{ textAlign: "end" }}>
                        <p style={{ margin: "0 0 5px" }}>Date : September 11, 2024</p>
                        <p
                            style={{
                                margin: "0 0 5px",
                                fontWeight: 800,
                                borderBottom: "2px solid black",
                                padding: "10px 0"
                            }}
                        >
                            Sign
                        </p>
                        <p style={{ margin: "0 0 5px" }}>DDD Cabs</p>
                        <p style={{ margin: "0 0 5px" }}>Authorized Sign</p>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: 40, textAlign: "center" }}>
                <p
                    style={{ background: "#37858D", margin: 0, padding: 10, color: "white" }}
                >
                    Thank you for renting with <strong>DDD Cabs</strong>!
                </p>
            </div>
        </>

    )
}


export default Invoice;