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
                if (existingCart.length > 0) {
                    const response = await fetch('https://localhost:7061/api/ShoppingCart/get-cart-anonymous', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(existingCart),
                    })
                    if (response.ok) {
                        const data = await response.json();
                        setCartItems(data);
                        var total = 0;
                        data.forEach((item) => {
                            total = total + parseFloat(item.price);
                        });
                        setTotalPrice(total);
                    } else {
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
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
    console.log(cartItems);
    return (
        <>
            <Navbar darkmode={false} />
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '86%', margin: '100px auto 100px auto', justifyContent: 'center' }}>
                <p style={{ width: '100%', textAlign: 'center', color: 'black', fontSize: '40px', fontFamily: 'SF-Pro-Display-Semibold' }}>Your cart total is ${totalPrice}</p>
                <Button background={'#0071e3'} text={"Checkout"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} />
                {cartItems.map((item, index) => (
                    <div style={{ display: 'flex', width: '80%', justifyContent: 'center', margin: '0', borderTop: index === 0 ? '1px solid #d6d6db' : 'none', borderBottom: '1px solid #d6d6db', padding: '50px 0 50px 0' }}>
                        {item.image ? <div style={{ width: '30%' }}>
                            <img src={item.image} style={{ borderRadius: '10px', width: '100%', height: '100%', objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
                        </div> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%', height: '175px', background: '#f6f5f8', borderRadius: '10px' }}>
                            <p style={{ textAlign: 'center' }}>No images available</p>
                        </div>}
                        <div style={{ width: '70%' }}>
                            <p style="">{item.name}</p>
                            {item.color ? <p>Color: {item.color}</p> : null}
                            {item.memory ? <p>Memory: {item.memory}</p> : null}
                            {item.storage ? <p>Storage: {item.storage}</p> : null}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default ShoppingCart;
