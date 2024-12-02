/* eslint-disable no-control-regex */
import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Input';
import { useLocation } from "react-router-dom";
import Select from '../../../Components/Select';
import Button from '../../../Components/Button';
import Typography from '@mui/material/Typography';
import '../../../style.css';
import Collapse from '@mui/material/Collapse';
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';
import Modal3 from '../../../Components/Modal3';
import { fCurrency } from '../../../utils/format-number';
import jwt_decode from 'jwt-decode';
import { fVietNamTime } from '../../../utils/format-time';

export default function EditOrder() {
    const location = useLocation();
    const id = location.state?.id;
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState();
    const [open, setOpen] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const [formattedDate, setFormattedDate] = useState('');
    const [buttonComponent, setButtonComponent] = useState(null);
    const [text, setText] = useState();
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
        getOrder();
    }, []);

    useEffect(() => {
        let component;
        if (order && order.status === "Paid" && decodedToken['Role'] === "Order Processor") {
            component = <Button text={"Process"} onclick={() => toggleModal2('Processing')} background="black" textColor="white" />;
        } else if (order && order.status === "Processing" && decodedToken['Role'] === "Warehouse Staff") {
            component = <Button text={"Deliver"} onclick={() => toggleModal2('Deliver')} background="black" textColor="white" />;
        } else if (order && order.status === "Shipping" && decodedToken['Role'] === "Shipper") {
            component = <Button text={"Finish"} onclick={() => toggleModal2('Delivered')} background="black" textColor="white" />
        } else {
            component = null;
        }
        setButtonComponent(component);
    }, [order]);

    const getOrder = async () => {
        const response = await fetch(`https://localhost:7061/api/Order/getOrderDetails?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        data.productDetails.forEach(detail => {
            const memoryPrice = memoryPrices[detail.memory] || 0;
            const storagePrice = storagePrices[detail.storage] || 0;
            detail.productPrice = Number(detail.productPrice) + memoryPrice + storagePrice;
        });
        const date = new Date(data.dateCreated);
        const vietnamTime = fVietNamTime(date);
        setFormattedDate(vietnamTime);
        setOrder(data);
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }

    const toggleModal2 = (text) => {
        setText(text);
        setModalVisible(true);
    }

    const handleUpdate = async (detail) => {
        setLoading(true);
        const newShippingDetail = {
            note: detail,
            dateCreated: new Date().toISOString(),
            createdBy: decodedToken["Id"]
        };
        const updatedShippingDetails = [...order.shippingDetails, newShippingDetail];
        setOrder(prevOrder => ({
            ...prevOrder,
            shippingDetails: updatedShippingDetails,
            status: text === 'Deliver' ? 'Shipping' : text
        }));
        if (text === 'Refunded') {
            setModalVisible(!isModalVisible);
            await fetch('https://localhost:7061/api/Momo/cancelPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    OrderId: order.orderId,
                    ShippingDetails: updatedShippingDetails,
                    Status: text === 'Deliver' ? 'Shipping' : text
                }),
            });
        } else {
            setModalVisible(!isModalVisible);
            await fetch('https://localhost:7061/api/Order/updateOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    OrderId: order.orderId,
                    CustomerDetails: order.customerDetails,
                    ShippingDetails: updatedShippingDetails,
                    ProductDetails: order.productDetails,
                    Status: text === 'Deliver' ? 'Shipping' : text
                }),
            });
        }
        setLoading(false);
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 5000);
        window.scrollTo(0, 0);
    }

    const cancelOrder = () => {
        setModalVisible(!isModalVisible);
        setText('Refunded');
    }

    return (
        <>
            <Typography variant="h4" style={{ marginLeft: '3%' }}>Order Details</Typography>
            <div className='container7 display' style={{ paddingTop: '15px', paddingBottom: '20px' }}>
                <Collapse in={open} sx={{ width: '100%' }}>
                    <Alert sx={{ mb: 2 }}>
                        Processed order successfully!
                    </Alert>
                </Collapse>
                {order ? ( 
                    <>
                        <p style={{ width: '100%', color: 'black', fontSize: '18px', fontFamily: 'SF-Pro-Display-Semibold' }}>Order Details:</p>
                        <div style={{ width: '100%', display: 'flex', margin: 'auto', marginBottom: '20px' }}>
                            <div style={{ width: '48%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Order Id"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        disabled={true}
                                        inputValue={order.orderId}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '4%' }}></div>
                            <div style={{ width: '48%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Date Created"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        disabled={true}
                                        inputValue={formattedDate}
                                    />
                                </div>
                            </div>
                        </div>
                        <table className="productsTable" style={{ width: '100%', marginBottom: '5px' }}>
                            <tr>
                                <th style={{ width: '5%' }}>No.</th>
                                <th>Product name</th>
                                <th style={{ width: '10%' }}>Product image</th>
                                <th>Spec/Specs</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                            {order.productDetails.map((detail, index) => (
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
                        <div style={{ display: (decodedToken && decodedToken["Role"] === 'Order Manager') ? 'none' : 'flex', height: 'fit-content', width: 'fit-content', position: 'relative' }} className="formButtons">
                            <Button display={order.status === 'Refunded' || order.status === 'Confirmed' || order.status === 'Delivered' || (decodedToken && decodedToken["Role"] === 'Shipper' || decodedToken['Role'] === 'Warehouse Staff') ? 'none' : 'flex'} text={'Refund'} onclick={cancelOrder} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                            <div style={{ width: '15px', display: order.status === 'Refunded' || order.status === 'Confirmed' || order.status === 'Delivered' || (decodedToken && decodedToken["Role"] === 'Shipper') ? 'none' : 'block' }}></div>
                            {loading ? (
                                <div className="lds-spinner">
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                </div>
                            ) : (
                                buttonComponent
                            )}
                        </div>
                        <p style={{ width: '100%', color: 'black', fontSize: '18px', fontFamily: 'SF-Pro-Display-Semibold' }}>Shipping Details:</p>
                        <div className="timeline" style={{ width: '100%' }}>
                            {order.shippingDetails.map((detail, index) => (
                                <div className="timeline-item" key={index}>
                                    <div className="dot"></div>
                                    {index !== order.shippingDetails.length - 1 && <div className="line"></div>}
                                    <div className="content">
                                        <p>{detail.note}</p>
                                        <span className="time">{fVietNamTime(new Date(detail.dateCreated))}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ width: '100%', color: 'black', fontSize: '18px', fontFamily: 'SF-Pro-Display-Semibold' }}>Customer Details:</p>
                        <div style={{ width: '100%', display: 'flex', margin: 'auto', marginBottom: '10px' }}>
                            <div style={{ width: '48%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"First Name"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.firstName}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '4%' }}></div>
                            <div style={{ width: '48%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Last Name"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        disabled={true}
                                        inputValue={order.customerDetails.lastName}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', display: 'flex', margin: 'auto', marginBottom: '10px' }}>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Address"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.address}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '2%' }}></div>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"City/Province"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.cityProvince}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '4%' }}></div>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"District"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.district}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '2%' }}></div>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Ward"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.ward}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', display: 'flex', margin: 'auto', marginBottom: '10px' }}>
                            <div style={{ width: '48%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Email"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.email}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '4%' }}></div>
                            <div style={{ width: '48%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Phone Number"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.phoneNumber}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <Modal3 isVisible={isModalVisible} toggleModal={toggleModal} func={handleUpdate} text={text === 'Processing' ? 'Process' : text === 'Delivered' ? 'Finish' : text === 'Refunded' ? 'Refund' : text} />
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};
