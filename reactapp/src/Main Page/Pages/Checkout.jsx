import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import { useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const Checkout = () => {
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const location = useLocation();
    const total = location.state?.total;
    const [fn, setFn] = useState('');
    const [fnError, setFnError] = useState('');
    const [ln, setLn] = useState('');
    const [lnError, setLnError] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [zip, setZip] = useState('');
    const [zipError, setZipError] = useState(false);
    const [city, setCity] = useState('');
    const [cityError, setCityError] = useState(false);
    const [state, setState] = useState('');
    const [stateError, setStateError] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [number, setNumber] = useState('');
    const [numberError, setNumberError] = useState('');
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState('+84');

    const handleFnChange = (e) => {
        setFnError('');
        setFn(e.target.value);
    }

    const handleLnChange = (e) => {
        setLnError('');
        setLn(e.target.value);
    }

    const handleAddressChange = (e) => {
        setAddressError('');
        setAddress(e.target.value);
    }

    const handleZipChange = (e) => {
        setZipError(false);
        setZip(e.target.value);
    }

    const handleCityChange = (e) => {
        setCityError(false);
        setCity(e.target.value);
    }

    const handleStateChange = (e) => {
        setStateError(false);
        setState(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmailError('');
        setEmail(e.target.value);
    }

    const handleNumberChange = (e) => {
        setNumberError('');
        setNumber(e.target.value);
    }

    const routeChange = async () => {
        try {
            setLoading(true);
            var count = 0;
            if (fn.trim() === '') {
                setFnError('First name is required!');
            } else {
                setFnError('');
                count++;
            }
            if (ln.trim() === '') {
                setLnError('Last name is required!');
            } else {
                setLnError('');
                count++;
            }
            if (address.trim() === '') {
                setAddressError('Street address is required!');
            } else {
                setAddressError('');
                count++;
            }
            if (zip.trim() === '') {
                setZipError(true);
            } else {
                setZipError(false);
                count++;
            }
            if (city.trim() === '') {
                setCityError(true);
            } else {
                setCityError(false);
                count++;
            }
            if (state.trim() === '') {
                setStateError(true);
            } else {
                setStateError(false);
                count++;
            }
            if (number.trim() === '') {
                setNumberError('Phone number is required!');
            } else {
                setNumberError('');
                count++;
            }
            if (number.trim() === '') {
                setNumberError('Phone number is required!');
            } else {
                setNumberError('');
                count++;
            }
            const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if (!regex.test(email)) {
                setEmailError('Please enter a valid email!');
            } else {
                setEmailError('');
            }
            if (count === 8) {
                const checkoutRequest = {
                    UserId: decodedToken ? decodedToken["Id"] : null,
                    Products: decodedToken ? null : existingCart,
                    CustomerDetails: {
                        FirstName: fn,       
                        LastName: ln,
                        Address: address,
                        ZipCode: zip,
                        City: city,
                        State: state,
                        Email: email,
                        PhoneNumber: region + number
                    }
                };
                const response = await fetch('https://localhost:7061/api/Momo/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(checkoutRequest),
                })
                if (response.status === 200) {
                    const data = await response.json();
                    window.location.href = data.shortLink;
                    setLoading(false);
                    if (error) {
                        console.error('Stripe checkout error:', error);
                    }
                } else {
                    console.error('HTTP request failed with status:', response.status);
                    setLoading(false);
                }
            }
            else {
                setLoading(false);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <Navbar darkmode={false} />
            <div style={{ width: '62.5%', margin: 'auto' }}>
                <div style={{ paddingBottom: '10px', marginTop: '75px', display: 'flex', justifyContent: 'space-between', borderBottom: '0.2px solid #c3c3c3' }}>
                    <span style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '26px' }}>Checkout</span>
                    <span style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '16px' }}>Order Total: ${total}</span>
                </div>
                <div style={{ paddingBottom: '30px', display: 'flex', borderBottom: '0.2px solid #c3c3c3', flexWrap: 'wrap', flexDirection: 'column' }}>
                    <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '36px' }}>Where should we send your order?</p>
                    <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '26px', margin: '15px 0' }}>Enter your name and address</p>
                    <Input
                        placeholder={"First Name"}
                        isVisible={true}
                        icon={false}
                        borderRadius={"10px"}
                        error={fnError}
                        width={'50%'}
                        onInputChange={handleFnChange}
                        margin={'0'}
                        inputValue={fn}
                    />
                    <Input
                        placeholder={"Last Name"}
                        isVisible={true}
                        icon={false}
                        borderRadius={"10px"}
                        error={lnError}
                        width={'50%'}
                        onInputChange={handleLnChange}
                        margin={'15px 0 0 0'}
                        inputValue={ln}
                    />
                    <Input
                        placeholder={"Street Address"}
                        isVisible={true}
                        icon={false}
                        borderRadius={"10px"}
                        error={addressError}
                        width={'50%'}
                        onInputChange={handleAddressChange}
                        margin={'15px 0 0 0'}
                        inputValue={address}
                    />
                    <Input
                        placeholder={"Country/Region"}
                        isVisible={true}
                        icon={false}
                        borderRadius={"10px"}
                        width={'50%'}
                        margin={'15px 0 0 0'}
                        inputValue={"Việt Nam"}
                        disabled={true}
                    />
                    <div style={{ display: 'flex', width: '51.6%', gap: '15px' }}>
                        <Input
                            placeholder={"Zip Code"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"10px"}
                            width={'50%'}
                            onInputChange={handleZipChange}
                            margin={'15px 0 0 0'}
                            inputValue={zip}
                            type={"number"}
                            warning={zipError}
                        />
                        <Input
                            placeholder={"City"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"10px"}
                            warning={cityError}
                            width={'50%'}
                            onInputChange={handleCityChange}
                            margin={'15px 0 0 0'}
                            inputValue={city}
                        />
                        <Input
                            placeholder={"State"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"10px"}
                            warning={stateError}
                            width={'50%'}
                            onInputChange={handleStateChange}
                            margin={'15px 0 0 0'}
                            inputValue={state}
                        />
                    </div>
                    <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '26px', margin: '15px 0' }}>What's your contact information?</p>
                    <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
                        <div style={{ width: '50%' }}>
                            <Input
                                placeholder={"Email Address"}
                                isVisible={true}
                                icon={false}
                                borderRadius={"10px"}
                                error={emailError}
                                width={'100%'}
                                onInputChange={handleEmailChange}
                                margin={'15px 0 0 0'}
                                inputValue={email}
                            />
                        </div>
                        <p style={{ margin: '22px 0 0 30px', height: 'fit-content', color: 'black' }}>We'll email you a receipt and send order updates to your<br />mobile phone via SMS.</p>
                    </div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '50%', display: 'flex', flexWrap: 'wrap' }}>
                            <Input
                                placeholder={region}
                                isVisible={true}
                                icon={false}
                                borderRadius={"10px 0 0 10px"}
                                width={'14%'}
                                margin={'15px 0 0 0'}
                                disabled={true}
                            />
                            <Input
                                placeholder={"Phone Number"}
                                isVisible={true}
                                icon={false}
                                borderRadius={"0 10px 10px 0"}
                                error={numberError}
                                width={'86%'}
                                borderLeft={'none'}
                                onInputChange={handleNumberChange}
                                margin={'15px 0 0 0'}
                                inputValue={number}
                                type={"number"}
                            />
                        </div>
                        <p style={{ margin: '22px 0 0 45px', height: 'fit-content', color: 'black' }}>The phone number can't be changed after you<br />place the order, so please make sure it's correct'.</p>
                    </div>
                </div>
                {loading ? (
                    <div className="lds-spinner" style={{ margin: '0 0 100px 100px' }}>
                        <div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div>
                    </div>
                ) : (
                    <Button
                        background={'#0071e3'}
                        onclick={routeChange}
                        text={"Continue to Payment"}
                        radius={'10px'}
                        fontSize={'16px'}
                        margin={'25px 0 100px 0'}
                        width={'300px'}
                        padding={'16px'}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
