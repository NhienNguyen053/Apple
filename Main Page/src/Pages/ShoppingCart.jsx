import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Button from '../Components/Button';
import Input from '../Components/Input';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { fCurrency } from '../Components/utils/format-number';
import ViewportWidth from '../Components/ViewportWidth';

const ShoppingCart = () => {
    const API_BASE_URL = process.env.REACT_APP_API_HOST;
    const viewportWidth = ViewportWidth();
    let navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const [open, setOpen] = useState(false);
    const [updateCart, setUpdateCart] = useState(false);
    const [temp, setTemp] = useState([]);
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

    const handleKeyDown = async (id, color, memory, storage, index, e) => {
        if (e.key === 'Enter') {
            const value = e.target.value;
            if (!isPositiveNumber(value)) {
                handleInvalidInput(id);
            } else {
                const changeCart = {
                    Id: id,
                    Quantity: value
                }
                const response = await fetch(`${API_BASE_URL}/api/ShoppingCart/change-cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${jwtToken}`
                    },
                    body: JSON.stringify(changeCart),
                })
                if (response.status !== 204 && response.status !== 400) {
                    const data = await response.json();
                    const memoryPrice = memoryPrices[memory] || 0;
                    const storagePrice = storagePrices[storage] || 0;
                    setCartItems((prevItems) =>
                        prevItems.map(item =>
                            item.id === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: value, name: data.productName, price: Number(data.productPrice) + memoryPrice + storagePrice, total: ((Number(data.productPrice) + memoryPrice + storagePrice) * value).toFixed(2) } : item
                        )
                    );
                    if (!jwtToken) {
                        const updatedCart = existingCart.map(item =>
                            item.productId === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: parseInt(value), name: data.productName, price: Number(data.productPrice) + memoryPrice + storagePrice, total: ((Number(data.productPrice) + memoryPrice + storagePrice) * value).toFixed(2) } : item
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
                    }, 5000);
                }
                var total = 0;
                cartItems.forEach((item) => {
                    total = total + parseFloat(item.price) * item.quantity;
                    item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
                });
                setTotalPrice(total.toFixed(2));
                temp[index] = value;
            }
            setUpdateCart(!updateCart);
        }
    }

    const handleBlur = async (id, color, memory, storage, index, e) => {
        const value = e.target.value;
        if (!isPositiveNumber(value)) {
            handleInvalidInput(id);
        } else {
            const changeCart = {
                Id: id,
                Quantity: value
            }
            const response = await fetch(`${API_BASE_URL}/api/ShoppingCart/change-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${jwtToken}`
                },
                body: JSON.stringify(changeCart),
            })
            if (response.status !== 204 && response.status !== 400) {
                const data = await response.json();
                const memoryPrice = memoryPrices[memory] || 0;
                const storagePrice = storagePrices[storage] || 0;
                setCartItems((prevItems) =>
                    prevItems.map(item =>
                        item.id === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: value, name: data.productName, price: Number(data.productPrice) + memoryPrice + storagePrice, total: ((Number(data.productPrice) + memoryPrice + storagePrice) * value).toFixed(2) } : item
                    )
                );
                if (!jwtToken) {
                    const updatedCart = existingCart.map(item =>
                        item.productId === id && item.color === color && item.memory === memory && item.storage === storage ? { ...item, quantity: parseInt(value), name: data.productName, price: Number(data.productPrice) + memoryPrice + storagePrice, total: ((Number(data.productPrice) + memoryPrice + storagePrice) * value).toFixed(2) } : item
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
                }, 5000);
            }
            var total = 0;
            cartItems.forEach((item) => {
                total = total + parseFloat(item.price) * item.quantity;
                item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
            });
            setTotalPrice(total.toFixed(2));
            temp[index] = value;
        }
        setUpdateCart(!updateCart);
    }

    const handleInvalidInput = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item, index) =>
                item.id === id ? { ...item, quantity: temp[index] } : item
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

    const removeItem = async (id, color, memory, storage) => {
        if (decodedToken == null) {
            var total = 0;
            var cart = [];
            const newCart = cartItems.filter(a => a.id !== id || a.color !== color || a.memory !== memory || a.storage !== storage);
            newCart.forEach((item) => {
                const cartItem = {
                    productId: item.id,
                    color: item.color,
                    memory: item.memory,
                    storage: item.storage,
                    quantity: item.quantity
                };
                cart.push(cartItem);
                total = total + parseFloat(item.price) * item.quantity;
                item.total = (parseFloat(item.price) * item.quantity).toFixed(2);
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            setCartItems(newCart);
            setTotalPrice(total.toFixed(2));
        } else {
            const response = await fetch(`${API_BASE_URL}/api/ShoppingCart/remove-from-cart?id=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                var total = 0;
                const newCart = cartItems.filter(a => a.id !== id || a.color !== color || a.memory !== memory || a.storage !== storage);
                setCartItems(newCart);
                newCart.forEach((item) => {
                    total = total + parseFloat(item.price) * item.quantity;
                });
                setTotalPrice(total.toFixed(2));
            }
            else { }
        }
        setUpdateCart(!updateCart);
    }

    useEffect(() => {
        const updateCart = async () => {
            if (decodedToken == null) {
                if (existingCart.length > 0) {
                    const response = await fetch(`${API_BASE_URL}/api/ShoppingCart/get-cart-anonymous`, {
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
                            const memoryPrice = memoryPrices[item.memory] || 0;
                            const storagePrice = storagePrices[item.storage] || 0;
                            cart.push(cartItem);
                            temp.push(item.quantity);
                            total = total + parseFloat(Number(item.price) + memoryPrice + storagePrice) * item.quantity;
                            item.total = (parseFloat(Number(item.price) + memoryPrice + storagePrice) * item.quantity).toFixed(2);
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
                const response = await fetch(`${API_BASE_URL}/api/ShoppingCart/get-cart?userId=${decodedToken['Id']}`, {
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
                        const memoryPrice = memoryPrices[item.memory] || 0;
                        const storagePrice = storagePrices[item.storage] || 0;
                        item.price = Number(item.price) + memoryPrice + storagePrice;
                        total = total + item.price * item.quantity;
                        item.total = (item.price * item.quantity).toFixed(2);
                        temp.push(item.quantity);
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
        let path = `/checkout`;
        navigate(path, { state: { total: totalPrice } });
    }

    return (
        <>
            <Navbar darkmode={false} onCartChange={updateCart} />
            <Collapse in={open} sx={{ right: '10px', top: '10px', zIndex: 1000, position: 'absolute' }}>
                <Alert sx={{ mb: 2 }} severity="error">
                    Some product has been removed due to being unavailable!
                </Alert>
            </Collapse>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: viewportWidth > 1300 ? '86%' : '100%', margin: cartItems.length > 0 ? '100px auto 100px auto' : '100px auto 300px auto', justifyContent: 'center' }}>
                <p style={{ width: '100%', textAlign: 'center', color: 'black', fontSize: '40px', fontFamily: 'SF-Pro-Display-Semibold' }}>{cartItems.length != 0 ? `Your cart total is ${fCurrency(totalPrice)}` : 'Your cart is empty'}</p>
                <div style={{width: '100%'}}>
                    <Button background={'#0071e3'} onclick={cartItems.length != 0 ? routeChange2 : routeChange} text={cartItems.length != 0 ? "Checkout" : "Back to shopping"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} height={'34px'} />
                </div>
                {cartItems.map((item, index) => (
                    <div key={item.id} style={{ flexWrap: viewportWidth > 650 ? 'nowrap' : 'wrap', display: 'flex', gap: '25px', width: viewportWidth > 1020 ? '80%' : '90%', justifyContent: 'center', margin: '0', borderTop: index === 0 ? '1px solid #d6d6db' : 'none', borderBottom: '1px solid #d6d6db', padding: '50px 0 50px 0' }}>
                        {item.image ? <div style={{ width: viewportWidth > 1020 ? '30%' : (viewportWidth > 650 ? '25%' : '45%') }}>
                            <img src={item.image} style={{ borderRadius: '10px', width: '100%', height: '100%', objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
                        </div> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%', height: '175px', background: '#f6f5f8', borderRadius: '10px' }}>
                            <p style={{ textAlign: 'center' }}>No images available</p>
                        </div>}
                        <div style={{ width: viewportWidth > 1020 ? '40%' : (viewportWidth > 650 ? '30%' : '45%') }}>
                            <p style={{ fontFamily: 'SF-Pro-Display-Semibold', color: 'black', fontSize: '20px' }}>{item.name}</p>
                            {item.color ? <p className="shoppingCart" >Color: {item.color}</p> : null}
                            {item.memory ? <p className="shoppingCart" >Memory: {item.memory}</p> : null}
                            {item.storage ? <p className="shoppingCart" >Storage: {item.storage}</p> : null}
                        </div>
                        <div style={{ width: viewportWidth > 1020 ? '10%' : (viewportWidth > 650 ? '15%' : '45%') }}>
                            <Input
                                placeholder={"Quantity:"}
                                isVisible={true}
                                icon={false}
                                borderRadius={"15px"}
                                width={'95%'}
                                margin={'0 auto 0 auto'}
                                inputValue={item.quantity}
                                onInputChange={(e) => handleChange(item.id, item.color, item.memory, item.storage, e.target.value)}
                                onKeyPress={(e) => handleKeyDown(item.id, item.color, item.memory, item.storage, index, e)}
                                onBlur={(e) => handleBlur(item.id, item.color, item.memory, item.storage, index, e)}
                            />
                        </div>
                        <div style={{ width: viewportWidth > 1020 ? '20%' : (viewportWidth > 650 ? '30%' : '45%') }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <p style={{ textAlign: 'end', width: '100%', marginTop: 0, color: 'black', fontSize: '24px', fontFamily: 'SF-Pro-Display-Semibold' }}>{(fCurrency(item.total))}</p>
                                <a href="#" onClick={() => removeItem(item.id, item.color, item.memory, item.storage)} style={{ fontSize: '18px', fontFamily: 'SF-Pro-Display-Light' }}>Remove</a>
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
