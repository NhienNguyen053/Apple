import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import Cookies from 'js-cookie';
import { useSearchParams } from "react-router-dom";

const Order = () => {
    const [searchParams] = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const orderId = searchParams.get('id');

    useEffect(() => {
        const getOrderDetails = async () => {
            const response = await fetch(`https://localhost:7061/api/Order/getOrderDetails?id=${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
            setOrderDetails(data);
            if (data.status == "Placed") {
                var order = document.getElementById("order");
                var orderRight = document.getElementById("orderRight");
                if (order && orderRight) {
                    order.style.color = "white";
                    order.style.background = "black";
                    orderRight.style.borderLeftColor = "black";
                }
            } else if (data.status == "Canceled" || data.status == "Paid") {
                var payment = document.getElementById("payment");
                var paymentRight = document.getElementById("paymentRight");
                var paymentLeftTop = document.getElementById("paymentLeftTop");
                var paymentLeftBottom = document.getElementById("paymentLeftBottom");
                if (payment && paymentRight && paymentLeftBottom && paymentLeftTop) {
                    payment.style.color = "white";
                    payment.style.background = "black";
                    paymentRight.style.borderLeftColor = "black";
                    paymentLeftBottom.style.borderBottomColor = "black";
                    paymentLeftTop.style.borderTopColor = "black";
                }
            } else if (data.status == "Processing") {
                var processing = document.getElementById("processing");
                var processingRight = document.getElementById("processingRight");
                var processingLeftTop = document.getElementById("processingLeftTop");
                var processingLeftBottom = document.getElementById("processingLeftBottom");
                if (processing && processingRight && processingLeftBottom && processingLeftTop) {
                    processing.style.color = "white";
                    processing.style.background = "black";
                    processingRight.style.borderLeftColor = "black";
                    processingLeftBottom.style.borderBottomColor = "black";
                    processingLeftTop.style.borderTopColor = "black";
                }
            } else if (data.status == "Shipping") {
                var shipping = document.getElementById("shipping");
                var shippingRight = document.getElementById("shippingRight");
                var shippingLeftTop = document.getElementById("shippingLeftTop");
                var shippingLeftBottom = document.getElementById("shippingLeftBottom");
                if (shipping && shippingRight && shippingLeftBottom && shippingLeftTop) {
                    shipping.style.color = "white";
                    shipping.style.background = "black";
                    shippingRight.style.borderLeftColor = "black";
                    shippingLeftBottom.style.borderBottomColor = "black";
                    shippingLeftTop.style.borderTopColor = "black";
                }
            } else if (data.status == "Delivered") {
                var delivered = document.getElementById("delivered");
                var deliveredRight = document.getElementById("deliveredRight");
                if (delivered && deliveredRight) {
                    delivered.style.color = "white";
                    delivered.style.background = "black";
                    deliveredRight.style.borderLeftColor = "black";
                }
            }
        };
        getOrderDetails();
    }, []);

    return (
        <>
            <Navbar darkmode={false} />
            {orderDetails ? (
                <div style={{ width: '87.5%', margin: 'auto'}}>
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
                            <div id="order" className="progress-bar-text">Order</div>
                            <div id="orderRight" className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '13px' }}>
                            <div>
                                <div id="paymentLeftTop" className="triangle-top-right"></div>
                                <div id="paymentLeftBottom" className="triangle-bottom-right"></div>
                            </div>
                            <div id="payment" className="progress-bar-text">Payment</div>
                            <div id="paymentRight" className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '26px' }}>
                            <div>
                                <div id="processingLeftTop" className="triangle-top-right"></div>
                                <div id="processingLeftBottom" className="triangle-bottom-right"></div>
                            </div>
                            <div id="processing" className="progress-bar-text">Processing</div>
                            <div id="processingRight" className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '39px' }}>
                            <div>
                                <div id="shippingLeftTop" className="triangle-top-right"></div>
                                <div id="shippingLeftBottom" className="triangle-bottom-right"></div>
                            </div>
                            <div id="shipping" className="progress-bar-text">Shipping</div>
                            <div id="shippingRight" className="right-arrow"></div>
                        </div>
                        <div style={{ width: '20%', display: 'flex', position: 'relative', right: '52px' }}>
                            <div>
                                <div id="deliveredLeftTop" className="triangle-top-right"></div>
                                <div id="deliveredLeftBottom" className="triangle-bottom-right"></div>
                            </div>
                            <div id="delivered" className="progress-bar-text">Delivered</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', border: '1px solid #eeeff2', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '20px', fontFamily: 'SF-Pro-Display-Light', width: '100%', background: '#f2f3f7', height: '35px', alignItems: 'center', display: 'flex', paddingLeft: '20px' }}>Shipping Details</div>
                        <div class="timeline">
                            {orderDetails.shippingDetails.map((detail, index) => (
                                <div className="timeline-item" key={index}>
                                    <div className="dot"></div>
                                    {index !== orderDetails.shippingDetails.length - 1 && <div className="line"></div>}
                                    <div className="content">
                                        <p>{detail.note}</p>
                                        <span className="time">{detail.dateCreated}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', border: '1px solid #eeeff2', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '20px', width: '100%', alignItems: 'center', display: 'flex', paddingLeft: '20px', flexWrap: 'wrap' }}>
                            <p style={{ width: '100%', fontSize: '20px', fontFamily: 'SF-Pro-Display-Semibold', color: 'black' }}>Order Details<br /></p>
                            <div style={{ fontFamily: 'SF-Pro-Display-Light', fontSize: '14px' }}><span>Order number:</span> {orderDetails.orderId}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>Order date:</span> {orderDetails.dateCreated}</div>
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
                                            <p>Color: {detail.color}</p>
                                            <p>Storage: {detail.storage}</p>
                                            <p>Memory: {detail.memory}</p>
                                        </div>
                                    </td>
                                    <td>{detail.quantity}</td>
                                    <td>${detail.productPrice}</td>
                                    <td>${detail.productPrice * detail.quantity}</td>
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
