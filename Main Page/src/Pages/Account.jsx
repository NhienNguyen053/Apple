import { useEffect, useRef, useState } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Modal from '../Components/Modal';

const Account = () => {
    const [user, setUser] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`https://localhost:7061/api/Users/getUserById?Id=${decodedToken['Id']}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.shippingData.phoneNumber) {
                        data.shippingData.phoneNumber = data.shippingData.phoneNumber.substring(3);
                    }
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchUser();
    }, []);

    const deleteToken = () => {
        Cookies.remove('jwtToken');
    }

    const toggleModal = (event) => {
        if (event) {
            event.preventDefault();
        }
        setIsModalVisible(!isModalVisible);
    }

    const toggleModal2 = (event) => {
        if (event) {
            event.preventDefault();
        }
        setIsModalVisible2(!isModalVisible2);
    }

    const updateShipping = async (data, cityName, districtName, wardName) => {
        setUser(data);
        const shippingData = {
            firstName: data.shippingData.firstName,
            lastName: data.shippingData.lastName,
            streetAddress: data.shippingData.streetAddress,
            country: data.shippingData.streetAddress,
            cityProvince: cityName,
            district: districtName,
            ward: wardName,
            emailAddress: data.shippingData.emailAddress,
            phoneNumber: data.shippingData.phoneNumber === null ? null : "+84" + data.shippingData.phoneNumber
        }
        await fetch(`https://localhost:7061/api/Users/updateShipping?userId=${decodedToken['Id']}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(shippingData)
        });
    }

    return (
        <>
            <Navbar darkmode={false}/>
            {user ? ( 
                <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', margin: '48px 0 48px 0' }}>
                    <div style={{ background: '#f5f5f7', width: '100%' }}>
                        <div style={{ width: '66%', margin: 'auto', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e2e4' }}>
                            <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Semibold', fontSize: '20px' }}>Account</p>
                            <a href="/" style={{ margin: 'auto 0', fontSize: '14px' }} onClick={deleteToken}>Sign Out</a>
                        </div>
                        <p style={{ width: '66%', margin: '25px auto', fontSize: '35px', color: 'black', fontFamily: 'SF-Pro-Display-Semibold' }}>Hi, {user.firstName}.</p>
                    </div>
                    <div style={{ width: '100%' }}>
                        <div style={{ width: '66%', margin: 'auto auto 35px auto', display: 'flex', flexWrap: 'wrap'}}>
                            <p style={{ width: '100%', color: 'black', fontSize: '35px', fontFamily: 'SF-Pro-Display-Semibold' }}>Account Settings</p>
                            <div style={{ display: 'flex' }}>
                                <p style={{ margin: 0, color: 'black', fontSize: '25px', fontFamily: 'SF-Pro-Display-Semibold' }}>Shipping</p>
                                <div style={{ marginLeft: '150px' }}>
                                    <p style={{ margin: '5px', color: 'black', fontSize: '20px', fontFamily: 'SF-Pro-Display-Medium' }}>Shipping address</p>
                                    <p style={{ margin: '5px', color: 'black', fontSize: '20px', fontFamily: 'SF-Pro-Display-Light' }}>{user.shippingData.firstName} {user.shippingData.lastName}</p>
                                    <p style={{ margin: '5px', color: 'black', fontSize: '20px', fontFamily: 'SF-Pro-Display-Light' }}>{user.shippingData.country}</p>
                                    <a href="" onClick={toggleModal} style={{ margin: '5px', fontSize: '18px' }}>Edit</a>
                                </div>
                                <div style={{ marginLeft: '150px' }}>
                                    <p style={{ margin: '5px', color: 'black', fontSize: '20px', fontFamily: 'SF-Pro-Display-Medium' }}>Contact information</p>
                                    <a href="" onClick={toggleModal2} style={{ margin: '5px', fontSize: '18px' }}>Edit</a>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', background: '#f5f5f7' }}>
                        <div style={{ width: '66%', margin: 'auto' }}>
                            <div style={{ width: '40%', height: '250px', padding: '40px 42px 40px 42px', background: 'white', margin: '50px 0 50px 0', borderRadius: '25px' }}>
                                <p style={{ fontFamily: 'SF-Pro-Display-Semibold', color: 'black', fontSize: '30px', margin: '15px 0' }}>Your Orders.</p>
                                <p style={{ fontFamily: 'SF-Pro-Display-Regular', color: 'black', fontSize: '18px', margin: '15px 0' }}>Track, modify, or cancel an order or make a return.</p>
                                <a href="/account/orders" style={{ fontSize: '18px' }}>See your order history</a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <Footer />
            <Modal isVisible={isModalVisible} toggleModal={toggleModal} user={user} func={updateShipping} type={"Shipping"}/>
            <Modal isVisible={isModalVisible2} toggleModal={toggleModal2} user={user} func={updateShipping} type={"Contact"}/>
        </>
    );
};

export default Account;
