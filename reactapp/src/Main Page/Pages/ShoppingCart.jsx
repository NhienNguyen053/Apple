import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Button from '../Components/Button';
import Input from '../Components/Input';
import { Link, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import getStripe from '../Components/Stripe';

const ShoppingCart = () => {
    let navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleKeyDown = async (id, color, memory, storage, e) => {
        if (e.key === 'Enter') {
            const value = e.target.value;
            if (!isPositiveNumber(value)) {
                handleInvalidInput(id);
            } else {
                const changeCart = {
                    Id: id,
                    Quantity: value
                }
                const response = await fetch('https://localhost:7061/api/ShoppingCart/change-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${jwtToken}`
                    },
                    body: JSON.stringify(changeCart),
                })
                if (response.status !== 204 && response.status !== 400) {
                    const data = await response.json();
                    setCartItems((prevItems) =>
                        prevItems.map(item =>
                            item.id === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: value, name: data.productName, price: data.productPrice, total: (data.productPrice * value).toFixed(2) } : item
                        )
                    );
                    if (!jwtToken) {
                        const updatedCart = existingCart.map(item =>
                            item.productId === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: parseInt(value), name: data.productName, price: data.productPrice, total: (data.productPrice * value).toFixed(2) } : item
                        );
                        localStorage.setItem('cart', JSON.stringify(updatedCart));
                    }
                } else if (response.status == 400) {
                    setCartItems((prevItems) =>
                        prevItems.filter(item => item.id !== id)
                    );
                    existingCart.filter(item => item.id !== id);
                    localStorage.setItem('cart', JSON.stringify(existingCart));
                    setOpen(true);
                    setTimeout(() => {
                        setOpen(false);
                    }, 3000);
                }
                var total = 0;
                cartItems.forEach((item) => {
                    total = total + parseFloat(item.price) * item.quantity;
                    item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
                });
                setTotalPrice(total.toFixed(2));
            }
        }
    }

    const handleBlur = async (id, color, memory, storage, e) => {
        const value = e.target.value;
        if (!isPositiveNumber(value)) {
            handleInvalidInput(id);
        } else {
            const changeCart = {
                Id: id,
                Quantity: value
            }
            const response = await fetch('https://localhost:7061/api/ShoppingCart/change-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${jwtToken}`
                },
                body: JSON.stringify(changeCart),
            })
            if (response.status !== 204 && response.status !== 400) {
                const data = await response.json();
                setCartItems((prevItems) =>
                    prevItems.map(item =>
                        item.id === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: value, name: data.productName, price: data.productPrice, total: (data.productPrice * value).toFixed(2) } : item
                    )
                );
                if (!jwtToken) {
                    const updatedCart = existingCart.map(item =>
                        item.productId === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: parseInt(value), name: data.productName, price: data.productPrice, total: (data.productPrice * value).toFixed(2) } : item
                    );
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                }
            } else if (response.status == 400) {
                setCartItems((prevItems) =>
                    prevItems.filter(item => item.id !== id)
                );
                if (!jwtToken) {
                    existingCart.filter(item => item.id !== id);
                    localStorage.setItem('cart', JSON.stringify(existingCart));
                }
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 3000);
            }
            var total = 0;
            cartItems.forEach((item) => {
                total = total + parseFloat(item.price) * item.quantity;
                item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
            });
            setTotalPrice(total.toFixed(2));
        }
    }

    const handleInvalidInput = (id) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: 1 } : item
            )
        );
    };

    const isPositiveNumber = (value) => {
        const number = Number(value);
        return number > 0 && number < 1000 && !isNaN(number);
    };

    const handleChange = (id, color, memory, storage, value) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: value } : item
            )
        );
    };

    useEffect(() => {
        const updateCart = async () => {
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
                        var total = 0;
                        var cart = [];
                        data.forEach((item) => {
                            const cartItem = {
                                productId: item.id,
                                color: item.color,
                                memory: item.memory,
                                storage: item.storage,
                                quantity: item.quantity
                            }
                            cart.push(cartItem);
                            total = total + parseFloat(item.price) * item.quantity;
                            item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
                        });
                        localStorage.setItem('cart', JSON.stringify(cart));
                        setTotalPrice(total.toFixed(2));
                        setCartItems(data);
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
                    var total = 0;
                    data.forEach((item) => {
                        total = total + parseFloat(item.price) * item.quantity;
                        item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
                    });
                    setTotalPrice(total.toFixed(2));
                    setCartItems(data);
                } else {
                    setCartItems([]);
                }
            }
        }
        updateCart();
    }, []);

    const routeChange = () => {
        let path = `/`;
        navigate(path);
    }

    const routeChange2 = async () => {
        try {
            setLoading(true);
            const checkoutRequest = {
                UserId: decodedToken ? decodedToken["Id"] : null,
                Products: decodedToken ? null : existingCart
            };
            const response = await fetch('https://localhost:7061/api/Stripe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutRequest),
            })
            if (response.status === 200) {
                const data = await response.json();
                const stripe = await getStripe(data.pubKey);
                const { error } = await stripe.redirectToCheckout({
                    sessionId: data.sessionId
                });
                setLoading(true);
                if (error) {
                    console.error('Stripe checkout error:', error);
                }
            } else {
                console.error('HTTP request failed with status:', response.status);
                setLoading(false);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <Navbar darkmode={false} />
            <Collapse in={open} sx={{ right: '10px', top: '10px', zIndex: 1000, position: 'absolute' }}>
                <Alert sx={{ mb: 2 }} severity="error">
                    Some product has been removed due to being unavailable!
                </Alert>
            </Collapse>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '86%', margin: '100px auto 100px auto', justifyContent: 'center' }}>
                <p style={{ width: '100%', textAlign: 'center', color: 'black', fontSize: '40px', fontFamily: 'SF-Pro-Display-Semibold' }}>{cartItems.length != 0 ? `Your cart total is $${totalPrice}` : 'Your cart is empty'}</p>
                {loading ? (
                    <div style={{ width: '300px', marginBottom: '55px' }}>
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    </div>
                ) : (
                    <Button background={'#0071e3'} onclick={cartItems.length != 0 ? routeChange2 : routeChange} text={cartItems.length != 0 ? "Checkout" : "Back to shopping"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} />
                )}
                {cartItems.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', gap: '25px', width: '80%', justifyContent: 'center', margin: '0', borderTop: index === 0 ? '1px solid #d6d6db' : 'none', borderBottom: '1px solid #d6d6db', padding: '50px 0 50px 0' }}>
                        {item.image ? <div style={{ width: '30%' }}>
                            <img src={item.image} style={{ borderRadius: '10px', width: '100%', height: '100%', objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
                        </div> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%', height: '175px', background: '#f6f5f8', borderRadius: '10px' }}>
                            <p style={{ textAlign: 'center' }}>No images available</p>
                        </div>}
                        <div style={{ width: '40%' }}>
                            <p style={{ fontFamily: 'SF-Pro-Display-Semibold', color: 'black', fontSize: '20px' }}>{item.name}</p>
                            {item.color ? <p className="shoppingCart" >Color: {item.color}</p> : null}
                            {item.memory ? <p className="shoppingCart" >Memory: {item.memory}</p> : null}
                            {item.storage ? <p className="shoppingCart" >Storage: {item.storage}</p> : null}
                        </div>
                        <div style={{ width: '10%' }}>
                            <Input
                                placeholder={"Quantity:"}
                                isVisible={true}
                                icon={false}
                                borderRadius={"15px"}
                                width={'95%'}
                                margin={'0 auto 0 auto'}
                                inputValue={item.quantity}
                                onInputChange={(e) => handleChange(item.id, item.color, item.memory, item.storage, e.target.value)}
                                onKeyPress={(e) => handleKeyDown(item.id, item.color, item.memory, item.storage, e)}
                                onBlur={(e) => handleBlur(item.id, item.color, item.memory, item.storage, e)}
                            />
                        </div>
                        <div style={{ width: '20%' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <p style={{ textAlign: 'end', width: '100%', marginTop: 0, color: 'black', fontSize: '24px', fontFamily: 'SF-Pro-Display-Semibold' }}>${(item.total)}</p>
                                <a href="" style={{ fontSize: '18px', fontFamily: 'SF-Pro-Display-Light' }}>Remove</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default ShoppingCart;
