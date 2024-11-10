import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { fCurrency } from '../Components/utils/format-number';
import Select from '../Components/Select';

const Checkout = () => {
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const navigate = useNavigate();
    const location = useLocation();
    const total = location.state?.total;
    const [fn, setFn] = useState('');
    const [fnError, setFnError] = useState('');
    const [ln, setLn] = useState('');
    const [lnError, setLnError] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityProvince, setCityProvince] = useState('');
    const [cityProvinceError, setCityProvinceError] = useState(false);
    const [district, setDistrict] = useState('');
    const [districtError, setDistrictError] = useState(false);
    const [ward, setWard] = useState('');
    const [wardError, setWardError] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [number, setNumber] = useState('');
    const [numberError, setNumberError] = useState('');
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState('+84');
    const [districtStatus, setDistrictStatus] = useState(true);
    const [wardStatus, setWardStatus] = useState(true);
    const [cityJson, setCityJson] = useState();
    const [districtJson, setDistrictJson] = useState();
    const [wardJson, setWardJson] = useState();

    useEffect(() => {
        if (!location.state || !location.state.total) {
            navigate('/notfound');
            return;
        }
        const fetchUserShippingData = async () => {
            try {
                if (decodedToken) {
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
                        setFn(data.shippingData.firstName !== null ? data.shippingData.firstName : '');
                        setLn(data.shippingData.lastName !== null ? data.shippingData.lastName : '');
                        setAddress(data.shippingData.streetAddress !== null ? data.shippingData.streetAddress : '');
                        setEmail(data.shippingData.emailAddress !== null ? data.shippingData.emailAddress : '');
                        setNumber(data.shippingData.phoneNumber !== null ? data.shippingData.phoneNumber : '');
                        const response2 = await fetch('https://vapi.vnappmob.com/api/province/', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        if (response2.ok) {
                            const data2 = await response2.json();
                            setCityJson(data2);
                            const decodedResults = data2.results.map(province => ({
                                ...province,
                                province_name: province.province_name,  
                                province_type: province.province_type   
                            }));
                            const cityData = decodedResults.find(province => province.province_name === data.shippingData.cityProvince);
                            if (cityData) {
                                handleCityProvinceChange(cityData.province_id, data.shippingData.district, data.shippingData.ward);
                            }
                        }
                    }
                } else {
                    const response2 = await fetch('https://vapi.vnappmob.com/api/province/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    if (response2.ok) {
                        const data2 = await response2.json();
                        setCityJson(data2);
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchUserShippingData();
    }, []);

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

    const handleCityProvinceChange = (e, districtName, wardName) => {
        if (districtName && wardName) {
            setCityProvinceError(false);
            setCityProvince(e);
            getDistrict(e, districtName, wardName);
            setDistrictStatus(false);
        } else {
            setWardStatus(true);
            setDistrict('');
            setWard('');
            setCityProvinceError(false);
            setCityProvince(e.target.value);
            getDistrict(e.target.value, null);
            setDistrictStatus(false);
        }
    }

    const handleDistrictChange = (e, wardName) => {
        if (wardName) {
            setWard('');
            setDistrictError(false);
            setDistrict(e);
            getWard(e, wardName);
            setWardStatus(false);
        }
        else {
            setDistrictError(false);
            setDistrict(e.target.value);
            getWard(e.target.value);
            setWardStatus(false);
        }
    }

    const handleWardChange = (e) => {
        setWardError(false);
        setWard(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmailError('');
        setEmail(e.target.value);
    }

    const handleNumberChange = (e) => {
        setNumberError('');
        setNumber(e.target.value);
    }

    const getDistrict = async(id, districtName, wardName) => {
        const response = await fetch(`https://vapi.vnappmob.com/api/province/district/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            const data = await response.json();
            setDistrictJson(data);
            if (districtName) {
                const decodedResults = data.results.map(district => ({
                    ...district,
                    district_name: district.district_name,
                    district_type: district.district_type
                }));
                const districtData = decodedResults.find(district => district.district_name === districtName);
                handleDistrictChange(districtData.district_id, wardName);
            }
        }
    }

    const getWard = async (id, wardName) => {
        const response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            const data = await response.json();
            setWardJson(data);
            if (wardName) {
                const decodedResults = data.results.map(ward => ({
                    ...ward,
                    ward_name: ward.ward_name,
                    ward_type: ward.ward_type
                }));
                const wardData = decodedResults.find(ward => ward.ward_name === wardName);
                setWard(wardData.ward_id);
            }
        }
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
                setAddressError('Address is required!');
            } else {
                setAddressError('');
                count++;
            }
            if (cityProvince.trim() === '') {
                setCityProvinceError(true);
            } else {
                setCityProvinceError(false);
                count++;
            }
            if (district.trim() === '') {
                setDistrictError(true);
            } else {
                setDistrictError(false);
                count++;
            }
            if (ward.trim() === '') {
                setWardError(true);
            } else {
                setWardError(false);
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
                count++;
            }
            if (count === 8) {
                const cityName = cityJson.results.find(record => record.province_id === cityProvince) ? cityJson.results.find(record => record.province_id === cityProvince).province_name : '';
                const districtName = districtJson.results.find(record => record.district_id === district) ? districtJson.results.find(record => record.district_id === district).district_name : '';
                const wardName = wardJson.results.find(record => record.ward_id === ward) ? wardJson.results.find(record => record.ward_id === ward).ward_name : '';
                const checkoutRequest = {
                    UserId: decodedToken ? decodedToken["Id"] : null,
                    Products: decodedToken ? null : existingCart,
                    CustomerDetails: {
                        FirstName: fn,       
                        LastName: ln,
                        Address: address,
                        CityProvince: cityName,
                        District: districtName,
                        Ward: wardName,
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
                    <span style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '16px' }}>Order Total: {fCurrency(total)}</span>
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
                        placeholder={"Address"}
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
                    <Select
                        isVisible={true}
                        icon={false}
                        borderRadius={"10px"}
                        width={'50%'}
                        onInputChange={(e) => handleCityProvinceChange(e, null, null)}
                        margin={'15px 0 0 0'}
                        selectedValue={cityProvince}
                        type={"city/province"}
                        warning={cityProvinceError}
                        json={cityJson}
                    />
                    <div style={{ display: 'flex', width: '50%', gap: '15px' }}>
                        <Select
                            isVisible={true}
                            icon={false}
                            borderRadius={"10px"}
                            warning={districtError}
                            width={'50%'}
                            onInputChange={(e) => handleDistrictChange(e, null)}
                            margin={'15px 0 0 0'}
                            selectedValue={district}
                            disabled={districtStatus}
                            type={"district"}
                            json={districtJson}
                        />
                        <Select
                            isVisible={true}
                            icon={false}
                            borderRadius={"10px"}
                            warning={wardError}
                            width={'50%'}
                            onInputChange={(e) => handleWardChange(e, false)}
                            margin={'15px 0 0 0'}
                            selectedValue={ward}
                            disabled={wardStatus}
                            type={"ward"}
                            json={wardJson}
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
