/* eslint-disable no-control-regex */
import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Input';
import { useNavigate, useLocation } from "react-router-dom";
import Select from '../../../Components/Select';
import Button from '../../../Components/Button';
import Typography from '@mui/material/Typography';
import '../../../style.css';
import Collapse from '@mui/material/Collapse';
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';
import Modal2 from '../../../Components/Modal2';
import { fCurrency } from '../../../utils/format-number';

export default function EditOrder() {
    const location = useLocation();
    const id = location.state?.id;
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState();
    const [error, setError] = useState({ firstName: '', lastName: '', address: false, zipCode: false, city: false, state: false })
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isModalVisible, setModalVisible] = useState(false);
    const jwtToken = Cookies.get('jwtToken');

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = async () => {
        const response = await fetch(`https://localhost:7061/api/Order/getOrderDetails?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setOrder(data);
    }

    const updateOrder = (section, fieldOrValue, value = null) => {
        if (value === null) {
            setOrder((prevOrder) => ({
                ...prevOrder,
                [section]: fieldOrValue
            }));
        } else {
            setOrder((prevOrder) => ({
                ...prevOrder,
                [section]: {
                    ...prevOrder[section],
                    [fieldOrValue]: value
                }
            }));
            if (fieldOrValue === "firstName" || fieldOrValue === "lastName") {
                setError((prevError) => ({
                    ...prevError,
                    [fieldOrValue]: ''
                }));
            }
            else {
                setError((prevError) => ({
                    ...prevError,
                    [fieldOrValue]: false
                }));
            }
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }

    const handleUpdate = async (detail) => {
        setLoading(true);
        var count = 0;
        if (order.customerDetails.firstName.trim() === '') {
            setError((prevError) => ({
                ...prevError,
                firstName: 'Enter a first name'
            }));
        } else {
            count++;
        }
        if (order.customerDetails.lastName.trim() === '') {
            setError((prevError) => ({
                ...prevError,
                lastName: 'Enter a last name'
            }));
        } else {
            count++;
        }
        if (order.customerDetails.address.trim() === '') {
            setError((prevError) => ({
                ...prevError,
                address: true
            }));
        } else {
            count++;
        }
        if (order.customerDetails.zipCode === null || order.customerDetails.zipCode === undefined || order.customerDetails.zipCode <= 0) {
            setError((prevError) => ({
                ...prevError,
                zipCode: true
            }));
        } else {
            count++;
        }
        if (order.customerDetails.city.trim() === '') {
            setError((prevError) => ({
                ...prevError,
                city: true
            }));
        } else {
            count++;
        }
        if (order.customerDetails.state.trim() === '') {
            setError((prevError) => ({
                ...prevError,
                state: true
            }));
        } else {
            count++;
        }
        if (count === 6) {
            const newShippingDetail = {
                note: detail,
                dateCreated: new Date().toISOString()
            };
            const updatedShippingDetails = [...order.shippingDetails, newShippingDetail];
            setOrder(prevOrder => ({
                ...prevOrder,
                shippingDetails: updatedShippingDetails,
                status: order.status === "Paid" ? "Processing" : "Shipping"
            }));
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
                    Status: order.status === "Paid" ? "Processing" : "Shipping"
                }),
            });
            setLoading(false);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 3000);
        } else {
            setModalVisible(!isModalVisible);
            setLoading(false);
        }
        window.scrollTo(0, 0);
    }

    const back = () => {
        navigate('/dashboard/orders');
    }

    return (
        <>
            <Typography variant="h4" style={{ marginLeft: '3%' }}>Edit Order</Typography>
            <div className='container7 display'>
                <Collapse in={open} sx={{ width: '100%' }}>
                    <Alert sx={{ mb: 2 }}>
                        Updated order successfully!
                    </Alert>
                </Collapse>
                {order ? ( 
                    <>
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
                                        onInputChange={(e) => updateOrder('customerDetails', 'firstName', e.target.value)}
                                        error={error.firstName}
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
                                        inputValue={order.customerDetails.lastName}
                                        onInputChange={(e) => updateOrder('customerDetails', 'lastName', e.target.value)}
                                        error={error.lastName}
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
                                        onInputChange={(e) => updateOrder('customerDetails', 'address', e.target.value)}
                                        warning={error.address}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '2%' }}></div>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"Zip"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.zipCode}
                                        onInputChange={(e) => updateOrder('customerDetails', 'zipCode', e.target.value)}
                                        type={'number'}
                                        warning={error.zipCode}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '4%' }}></div>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"City"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.city}
                                        onInputChange={(e) => updateOrder('customerDetails', 'city', e.target.value)}
                                        warning={error.city}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '2%' }}></div>
                            <div style={{ width: '23%' }} className="formInputs2">
                                <div>
                                    <Input
                                        placeholder={"State"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"5px"}
                                        width={'100%'}
                                        margin={'0 auto 0 auto'}
                                        inputValue={order.customerDetails.state}
                                        onInputChange={(e) => updateOrder('customerDetails', 'state', e.target.value)}
                                        warning={error.state}
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
                                        onInputChange={(e) => updateOrder('customerDetails', 'email', e.target.value)}
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
                                        onInputChange={(e) => updateOrder('customerDetails', 'phoneNumber', e.target.value)}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <p style={{ width: '100%', color: 'black', fontSize: '18px', fontFamily: 'SF-Pro-Display-Semibold' }}>Shipping Details:</p>
                        <div class="timeline" style={{ width: '100%' }}>
                            {order.shippingDetails.map((detail, index) => (
                                <div className="timeline-item" key={index}>
                                    <div className="dot"></div>
                                    {index !== order.shippingDetails.length - 1 && <div className="line"></div>}
                                    <div className="content">
                                        <p>{detail.note}</p>
                                        <span className="time">{detail.dateCreated}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                        inputValue={order.dateCreated}
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
                                            <p>Color: {detail.color}</p>
                                            <p>Storage: {detail.storage}</p>
                                            <p>Memory: {detail.memory}</p>
                                        </div>
                                    </td>
                                    <td>{detail.quantity}</td>
                                    <td>{fCurrency(detail.productPrice)}</td>
                                    <td>{fCurrency(detail.productPrice * detail.quantity)}</td>
                                </tr>
                            ))}
                        </table>
                        <div style={{ display: 'flex', height: 'fit-content', width: 'fit-content', position: 'relative' }} className="formButtons">
                            <Button text={'Back'} onclick={back} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                            <div style={{ width: '15px' }}></div>
                            {loading ? (
                                <div className="lds-spinner">
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                </div>
                            ) : (
                                order.status === "Paid" || order.status === "Processing" ? (
                                    <Button text={order.status === "Paid" ? "Continue to processing" : "Continue to Shipping"} onclick={toggleModal} background="black" textColor="white" />
                                ) : null
                            )}
                        </div>
                        <Modal2 isVisible={isModalVisible} toggleModal={toggleModal} func={handleUpdate} text2={order.status === "Paid" ? "Processing" : "Shipping"}/>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};
