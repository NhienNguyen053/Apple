import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Button from '../Components/Button';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const updateCart = async () => {
            const jwtToken = Cookies.get('jwtToken');
            const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
            const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
            if (decodedToken == null) {
                setCartItems(existingCart);
                var total = 0;
                existingCart.forEach((item) => {
                    total = total + parseFloat(item.price);
                });
                setTotalPrice(total);
            } else {
                const response = await fetch(`https://localhost:7061/api/ShoppingCart/get-cart?userId=${decodedToken['Id']}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    setCartItems(data);
                    var total = 0;
                    data.forEach((item) => {
                        console.log(parseFloat(item.price))
                        total = total + parseFloat(item.price);
                    });
                    setTotalPrice(total);
                } else {
                    setCartItems([]);
                }
            }
        }
        updateCart();
    }, []);

    return (
        <>
            <Navbar darkmode={false} />
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '86%', margin: '100px auto 0 auto', justifyContent: 'center' }}>
                <p style={{ width: '100%', textAlign: 'center', color: 'black', fontSize: '40px', fontFamily: 'SF-Pro-Display-Semibold' }}>Your cart total is ${totalPrice}</p>
                <Button background={'#0071e3'} text={"Checkout"} radius={'10px'} fontSize={'16px'} margin={'auto 0'} width={'300px'} />
                {cartItems.map((item) => (
                    <div style={{ display: 'flex', width: '80%', justifyContent: 'center', margin: '100px 0 100px 0', borderTop: '1px solid #d6d6db', borderBottom: '1px solid #d6d6db', padding: '50px 0 50px 0' }}>
                        {item.image ? <div style={{ width: '30%' }}>
                            <img src={item.image} style={{ borderRadius: '10px', width: '100%', height: '100%', objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
                        </div> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '75px', width: '75px', background: '#f6f5f8', borderRadius: '10px' }}>
                            <p style={{ textAlign: 'center' }}>No images available</p>
                        </div>}
                        <div style={{ width: '70%' }}>
                            <p></p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default ShoppingCart;
