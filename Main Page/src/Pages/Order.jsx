import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import Cookies from 'js-cookie';
import { useSearchParams, useNavigate } from "react-router-dom";
import { fCurrency } from '../Components/utils/format-number';
import { fVietNamTime } from '../Components/utils/format-time';
import ViewportWidth from '../Components/ViewportWidth';

const Order = () => {
    const API_BASE_URL = process.env.REACT_APP_API_HOST;
    const viewportWidth = ViewportWidth();
    const [searchParams] = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [active, setActive] = useState('');
    const navigate = useNavigate(); 
    const orderId = searchParams.get('id');
    const memoryPrices = {
        '4GB': 1242250,
        '8GB': 2484500,
        '16GB': 3726750,
        '32GB': 4969000,
        '64GB': 6211250
    };

    const storagePrices = {
        '64GB': 1242250,
        '128GB': 2484500,
        '256GB': 3726750,
        '512GB': 4969000,
        '1TB': 6211250,
        '2TB': 7453500
    };

    useEffect(() => {
        const getOrderDetails = async () => {
            const response = await fetch(`${API_BASE_URL}/api/Order/getOrderDetails?id=${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 400) {
                navigate('/notfound');
            } else {
                const data = await response.json();
                data.productDetails.forEach(detail => {
                    const memoryPrice = memoryPrices[detail.memory] || 0;
                    const storagePrice = storagePrices[detail.storage] || 0;
                    detail.productPrice = Number(detail.productPrice) + memoryPrice + storagePrice;
                });
                const date = new Date(data.dateCreated);
                const vietnamTime = date.toLocaleString("en-GB", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
                data.dateCreated = vietnamTime;
                setOrderDetails(data);
                setActive(data.status);
            }
        };
        getOrderDetails();
    }, []);

    const confirm = async (event) => {
        event.preventDefault();
        await fetch(`${API_BASE_URL}/api/Order/confirmOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails.orderId)
        });
        const updatedOrderDetails = { ...orderDetails, status: "Confirmed" };
        setOrderDetails(updatedOrderDetails);
        setActive("Confirmed");
    }

    const refund = async (event) => {
        event.preventDefault();

        const updatedOrderDetails = {
            Status: "Refunded",
            ShippingDetails: [
                ...orderDetails.shippingDetails,
                {
                    note: 'Order Refunded',
                    dateCreated: new Date().toISOString(),
                    createdBy: null,
                    assignedTo: null
                }
            ],
            OrderId: orderDetails.orderId
        };

        await fetch(`${API_BASE_URL}/api/Momo/cancelPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrderDetails)
        });

        const formattedOrderDetails = {
            ...orderDetails,
            ShippingDetails: updatedOrderDetails.ShippingDetails.map(detail => ({
                ...detail,
                dateCreated: new Date(detail.dateCreated).toLocaleString("en-GB", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            })),
            status: 'Refunded'
        };
        console.log(formattedOrderDetails)
        setOrderDetails(formattedOrderDetails);
        setActive("Refunded");
    };

    return (
        <>
            <Navbar darkmode={false} />
            {orderDetails ? (
                <div style={{ width: viewportWidth > 750 ? '87.5%' : '100%', margin: 'auto' }}>
                    <div style={{ paddingBottom: '10px', marginTop: '75px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src="/apple-logo.png" style={{ width: '45px', height: '45px' }} alt="Apple Logo" />
                            <span style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '20px' }}>Apple Order</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '16px' }}>Order Number: {orderDetails.orderId}</span>
                        </div>
                    </div>
                    <div style={{ width: '104%', display: 'flex', height: '35px', textAlign: 'center', marginBottom: '20px', overflow: 'hidden' }}>
                        <div style={{ width: '20%', display: 'flex' }}>
                            <div style={{ color: active == 'Placed' ? 'white' : '', background: active == 'Placed' ? 'black' : '' }} className="progress-bar-text">Order</div>
                            <div style={{ borderLeftColor: active == 'Placed' ? 'black' : '' }} className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '1%' }}>
                            <div>
                                <div style={{ borderTopColor: active == 'Paid' ? 'black' : '' }} className="triangle-top-right"></div>
                                <div style={{ borderBottomColor: active == 'Paid' ? 'black' : '' }}  className="triangle-bottom-right"></div>
                            </div>
                            <div style={{ color: active == 'Paid' ? 'white' : '', background: active == 'Paid' ? 'black' : '' }} className="progress-bar-text">Payment</div>
                            <div style={{ borderLeftColor: active == 'Paid' ? 'black' : '' }} className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '2%' }}>
                            <div>
                                <div style={{ borderTopColor: active == 'Processing' ? 'black' : '' }} className="triangle-top-right"></div>
                                <div style={{ borderBottomColor: active == 'Processing' ? 'black' : '' }} className="triangle-bottom-right"></div>
                            </div>
                            <div style={{ color: active == 'Processing' ? 'white' : '', background: active == 'Processing' ? 'black': '' }} className="progress-bar-text">Processing</div>
                            <div style={{ borderLeftColor: active == 'Processing' ? 'black' : '' }} className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '3%' }}>
                            <div>
                                <div style={{ borderTopColor: active == 'Shipping' ? 'black' : '' }} className="triangle-top-right"></div>
                                <div style={{ borderBottomColor: active == 'Shipping' ? 'black' : '' }} className="triangle-bottom-right"></div>
                            </div>
                            <div style={{ color: active == 'Shipping' ? 'white' : '', background: active == 'Shipping' ? 'black' : '' }} className="progress-bar-text">Shipping</div>
                            <div style={{ borderLeftColor: active == 'Shipping' ? 'black' : '' }} className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '4%' }}>
                            <div>
                                <div style={{ borderTopColor: active == 'Delivered' ? 'black' : '' }} className="triangle-top-right"></div>
                                <div style={{ borderBottomColor: active == 'Delivered' ? 'black' : '' }} className="triangle-bottom-right"></div>
                            </div>
                            <div style={{ color: active == 'Delivered' ? 'white' : '', background: active == 'Delivered' ? 'black' : '' }} className="progress-bar-text">Delivered</div>
                        </div>
                    </div>
                    <div style={{ background: '#fffbf6', display: orderDetails.status === 'Confirmed' ? 'flex' : 'none', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <p style={{ width: '97%', margin: '10px auto', fontFamily: 'SF-Pro-Display-Semibold', color: 'black' }}>Order Completed</p>
                        <p style={{ width: '97%', margin: '0 auto 10px auto', color: 'black', fontSize: '14px' }}>This order is complete. If you did not confirm receipt, it may be that the system has automatically confirmed completion. Automatic confirmation occurs 3 days after shipment if there are no delivery tracking details recorded within our system.</p>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', border: '1px solid #eeeff2', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '20px', fontFamily: 'SF-Pro-Display-Light', width: '100%', background: '#f2f3f7', height: '35px', alignItems: 'center', display: 'flex', padding: '0 20px', justifyContent: 'space-between' }}>
                            <p style={{ color: 'black' }}>Shipping Details</p>
                            <a onClick={orderDetails.status === 'Paid' ? refund : confirm} style={{ display: orderDetails.status === 'Delivered' || orderDetails.status === "Paid" ? 'block' : 'none' }}>{orderDetails.status === "Delivered" ? 'Confirm Delivery' : 'Refund Order'}</a>
                        </div>
                        <div className="timeline">
                            {orderDetails.shippingDetails && orderDetails.shippingDetails.map((detail, index) => (
                                <div className="timeline-item" key={index}>
                                    <div className="dot"></div>
                                    {index !== orderDetails.shippingDetails.length - 1 && <div className="line"></div>}
                                    <div className="content">
                                        <p>{detail.note}</p>
                                        <span className="time">{fVietNamTime(new Date(detail.dateCreated))}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', border: '1px solid #eeeff2', marginBottom: '20px', overflowX: 'auto' }}>
                        <div style={{ marginBottom: '20px', width: '100%', alignItems: 'center', display: 'flex', paddingLeft: '20px', flexWrap: 'wrap' }}>
                            <p style={{ width: '100%', fontSize: '20px', fontFamily: 'SF-Pro-Display-Semibold', color: 'black' }}>Order Details<br /></p>
                            <div style={{ fontFamily: 'SF-Pro-Display-Light', fontSize: '14px' }}><span>Order number:</span> {orderDetails.orderId}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>Order date:</span> {orderDetails.dateCreated}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>Status:</span> {orderDetails.status}</div>
                        </div>
                        <table className="productsTable">
                            <tr>
                                <th style={{ width: '5%' }}>No.</th>
                                <th>Product name</th>
                                <th style={{ width: '10%' }}>Product image</th>
                                <th>Spec/Specs</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                            {orderDetails.productDetails.map((detail, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{detail.productName}</td>
                                    <td><img src={detail.productImage} style={{ width: '75px', height: '75px' }} /></td>
                                    <td>
                                        <div>
                                            <p style={{ display: detail.color ? '' : 'none' }}>Color: {detail.color}</p>
                                            <p style={{ display: detail.storage ? '' : 'none' }}>Storage: {detail.storage}</p>
                                            <p style={{ display: detail.memory ? '' : 'none' }}>Memory: {detail.memory}</p>
                                        </div>
                                    </td>
                                    <td>{detail.quantity}</td>
                                    <td>{fCurrency(detail.productPrice)}</td>
                                    <td>{fCurrency(detail.productPrice * detail.quantity)}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <Footer />
        </>
    );
};

export default Order;
