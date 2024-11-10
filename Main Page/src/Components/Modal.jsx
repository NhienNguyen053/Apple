import { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const Modal = ({ user, isVisible, toggleModal, func, type }) => {
    const [userData, setUserData] = useState(null);
    const [errors, setErrors] = useState({
        firstName: false, lastName: false, streetAddress: false,
        cityProvince: false, district: false, ward: false,
        emailAddress: false, phoneNumber: false
    });
    const [cityJson, setCityJson] = useState();
    const [districtJson, setDistrictJson] = useState();
    const [wardJson, setWardJson] = useState();
    const [districtStatus, setDistrictStatus] = useState(true);
    const [wardStatus, setWardStatus] = useState(true);

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);

    useEffect(() => {
        const fetchCityJson = async () => {
            const response = await fetch('https://vapi.vnappmob.com/api/province/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCityJson(data);
                if (userData && userData.shippingData && userData.shippingData.cityProvince) {
                    const decodedResults = data.results.map(province => ({
                        ...province,
                        province_name: province.province_name,
                        province_type: province.province_type
                    }));
                    const cityData = decodedResults.find(province => province.province_name === userData.shippingData.cityProvince);
                    if (cityData) {
                        setDistrictStatus(false);
                        const response2 = await fetch(`https://vapi.vnappmob.com/api/province/district/${cityData.province_id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        if (response2.ok) {
                            const data2 = await response2.json();
                            setDistrictJson(data2);
                            const decodedResults2 = data2.results.map(district => ({
                                ...district,
                                district_name: district.district_name,
                                district_type: district.district_type
                            }));
                            const districtData = decodedResults2.find(district => district.district_name === userData.shippingData.district);
                            if (districtData) {
                                setWardStatus(false);
                                const response3 = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtData.district_id}`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                if (response3.ok) {
                                    const data3 = await response3.json();
                                    setWardJson(data3);
                                    const decodedResults3 = data3.results.map(ward => ({
                                        ...ward,
                                        ward_name: ward.ward_name,
                                        ward_type: ward.ward_type
                                    }));
                                    const wardData = decodedResults3.find(ward => ward.ward_name === userData.shippingData.ward);
                                    if (wardData) {
                                        setUserData(prevUserData => ({
                                            ...prevUserData,
                                            shippingData: {
                                                ...prevUserData.shippingData,
                                                cityProvince: cityData.province_id,
                                                district: districtData.district_id,
                                                ward: wardData.ward_id
                                            },
                                        }));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        if (userData) {
            fetchCityJson();
        }
    }, [userData]);


    const handleShippingChange = (e, field) => {
        let newErrors = { ...errors };
        newErrors[field] = false;
        setUserData({
            ...userData,
            shippingData: {
                ...userData.shippingData,
                [field]: e.target.value,
            },
        });
        if (field === 'cityProvince') {
            setUserData(prevUserData => ({
                ...prevUserData,
                shippingData: {
                    ...prevUserData.shippingData,
                    district: '',
                    ward: ''
                },
            }));
            setWardStatus(true);
            getDistrict(e.target.value);
            setDistrictStatus(false);
        }
        else if (field === 'district') {
            setUserData(prevUserData => ({
                ...prevUserData,
                shippingData: {
                    ...prevUserData.shippingData,
                    ward: ''
                },
            }));
            getWard(e.target.value);
            setWardStatus(false);
        }
        setErrors(newErrors);
    };

    const getDistrict = async (id) => {
        const response = await fetch(`https://vapi.vnappmob.com/api/province/district/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            const data = await response.json();
            setDistrictJson(data);
        }
    }

    const getWard = async (id) => {
        const response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            const data = await response.json();
            setWardJson(data);
        }
    }

    const handleSave = () => {
        let hasError = false;
        let newErrors = { ...errors };
        
        if (!userData.shippingData.firstName?.trim()) {
            newErrors.firstName = true;
            hasError = true;
        }
        if (!userData.shippingData.lastName?.trim()) {
            newErrors.lastName = true;
            hasError = true;
        }
        if (!userData.shippingData.streetAddress?.trim()) {
            newErrors.streetAddress = true;
            hasError = true;
        }
        if (!userData.shippingData.cityProvince?.trim()) {
            newErrors.cityProvince = true;
            hasError = true;
        }
        if (!userData.shippingData.district?.trim()) {
            newErrors.district = true;
            hasError = true;
        }
        if (!userData.shippingData.ward?.trim()) {
            newErrors.ward = true;
            hasError = true;
        }
        
        setErrors(newErrors);
        if (!hasError) {
            const cityName = cityJson.results.find(record => record.province_id === userData.shippingData.cityProvince) ? cityJson.results.find(record => record.province_id === userData.shippingData.cityProvince).province_name : '';
            const districtName = districtJson.results.find(record => record.district_id === userData.shippingData.district) ? districtJson.results.find(record => record.district_id === userData.shippingData.district).district_name : '';
            const wardName = wardJson.results.find(record => record.ward_id === userData.shippingData.ward) ? wardJson.results.find(record => record.ward_id === userData.shippingData.ward).ward_name : '';
            func(userData, cityName, districtName, wardName);
            toggleModal();
        }
    };

    const handleSave2 = () => {
        let hasError = false;
        let newErrors = { ...errors };

        const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!regex.test(userData.shippingData.emailAddress)) {
            newErrors.emailAddress = true;
            hasError = true;
        }

        if (!userData.shippingData.phoneNumber.trim()) {
            newErrors.phoneNumber = true;
            hasError = true;
        }
        setErrors(newErrors);
        if (!hasError) {
            func(userData);
            toggleModal();
        }
    }

    return (
        <div className="modalBg" style={{ display: isVisible ? 'block' : 'none' }}>
            <div className="modal" style={{ background: 'white', borderRadius: '25px', height: '690px', top: '50%', flexDirection: 'column' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'end', height: 'fit-content' }}>
                    <div onClick={toggleModal} className='x'>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
                <div style={{ display: 'flex', width: '80%', margin: '0 auto', height: 'fit-content', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {type === "Shipping" ? (
                        <>
                            <p style={{ fontFamily: 'SF-Pro-Display-Semibold', fontSize: '35px', color: 'black', margin: '20px 0' }}>Edit your shipping address.</p>
                            {userData ? ( 
                            <>
                                <Input
                                    placeholder={"First Name"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    margin={'0'}
                                    inputValue={userData.shippingData.firstName}
                                    onInputChange={(e) => handleShippingChange(e, 'firstName')}
                                    warning={errors.firstName}
                                />
                                <Input
                                    placeholder={"Last Name"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    margin={'10px 0 0 0'}
                                    inputValue={userData.shippingData.lastName}
                                    onInputChange={(e) => handleShippingChange(e, 'lastName')}
                                    warning={errors.lastName}
                                />
                                <Input
                                    placeholder={"Address"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    margin={'10px 0 0 0'}
                                    inputValue={userData.shippingData.streetAddress}
                                    onInputChange={(e) => handleShippingChange(e, 'streetAddress')}
                                    warning={errors.streetAddress}
                                />
                                <Input
                                    placeholder={"Country/Region"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    margin={'10px 0 0 0'}
                                    inputValue={"Việt Nam"}
                                    disabled={true}
                                />
                                <Select
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    onInputChange={(e) => handleShippingChange(e, 'cityProvince')}
                                    margin={'15px 0 0 0'}
                                    selectedValue={userData.shippingData.cityProvince}
                                    type={"city/province"}
                                    warning={errors.cityProvince}
                                    json={cityJson}
                                />
                                <div style={{ display: 'flex', width: '95%', gap: '15px' }}>
                                    <Select
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"10px"}
                                        warning={errors.district}
                                        width={'50%'}
                                        onInputChange={(e) => handleShippingChange(e, 'district')}
                                        margin={'15px 0 0 0'}
                                        selectedValue={userData.shippingData.district}
                                        disabled={districtStatus}
                                        type={"district"}
                                        json={districtJson}
                                    />
                                    <Select
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"10px"}
                                        warning={errors.ward}
                                        width={'50%'}
                                        onInputChange={(e) => handleShippingChange(e, 'ward')}
                                        margin={'15px 0 0 0'}
                                        selectedValue={userData.shippingData.ward}
                                        disabled={wardStatus}
                                        type={"ward"}
                                        json={wardJson}
                                    />
                                </div>
                            </>  
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <>
                            <p style={{ fontFamily: 'SF-Pro-Display-Semibold', fontSize: '35px', color: 'black', margin: '20px 0' }}>Edit your contact information.</p>
                            {userData ? ( 
                            <>
                                <Input
                                    placeholder={"Email Address"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    margin={'0'}
                                    inputValue={userData.shippingData.emailAddress}
                                    onInputChange={(e) => handleShippingChange(e, 'emailAddress')}
                                    warning={errors.emailAddress}
                                />
                                <div style={{ width: '95%', display: 'flex', flexWrap: 'wrap' }}>
                                    <Input
                                        placeholder={"+84"}
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
                                        width={'86%'}
                                        borderLeft={'none'}
                                        margin={'15px 0 0 0'}
                                        inputValue={userData.shippingData.phoneNumber}
                                        onInputChange={(e) => handleShippingChange(e, 'phoneNumber')}
                                        warning={errors.phoneNumber}
                                        type={"number"}
                                    />
                                </div>
                            </>  
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </div>
                <Button onclick={type === "Shipping" ? handleSave : handleSave2} text={"Save"} padding={"17px"} width={"76%"} radius={"12px"} background={'#0071e3'} margin={'25px auto 10px auto'}/>
                <Button onclick={toggleModal} text={"Cancel"} padding={"17px"} width={"76%"} radius={"12px"} background={'white'} textColor={"#0071e3"} margin={'5px auto 10px auto'}/>
            </div>
        </div>
    );
};

export default Modal;
