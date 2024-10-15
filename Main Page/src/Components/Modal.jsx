import { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';

const Modal = ({ user, isVisible, toggleModal, func, type }) => {
    const [userData, setUserData] = useState();
    const [errors, setErrors] = useState({ firstName: false, lastName: false, streetAddress: false, zipCode: false, city: false, state: false, emailAddress: false, phoneNumber: false });

    useEffect(() => {
        setUserData(user)
    }, [user]);

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
        setErrors(newErrors);
    };

    const handleSave = () => {
        let hasError = false;
        let newErrors = { ...errors };

        if (!userData.shippingData.firstName.trim()) {
            newErrors.firstName = true;
            hasError = true;
        }

        if (!userData.shippingData.lastName.trim()) {
            newErrors.lastName = true;
            hasError = true;
        }

        if (!userData.shippingData.streetAddress.trim()) {
            newErrors.streetAddress = true;
            hasError = true;
        }

        if (!userData.shippingData.zipCode) {
            newErrors.zipCode = true;
            hasError = true;
        }

        if (!userData.shippingData.city.trim()) {
            newErrors.city = true;
            hasError = true;
        }

        if (!userData.shippingData.state.trim()) {
            newErrors.state = true;
            hasError = true;
        }
        setErrors(newErrors);
        if (!hasError) {
            func(userData);
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
            <div className="modal" style={{ background: 'white', borderRadius: '25px', height: '605px', top: '50%', flexDirection: 'column' }}>
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
                                    placeholder={"Street Address"}
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
                                    placeholder={"Country"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"10px"}
                                    width={'95%'}
                                    margin={'10px 0 0 0'}
                                    inputValue={userData.shippingData.country}
                                    disabled={true}
                                />
                                <div style={{ display: 'flex', width: '95%', marginTop: '10px' }}>
                                    <Input
                                        placeholder={"Zip Code"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"10px"}
                                        width={'95%'}
                                        margin={'0'}
                                        inputValue={userData.shippingData.zipCode}
                                        onInputChange={(e) => handleShippingChange(e, 'zipCode')}
                                        type={"number"}
                                        warning={errors.zipCode}
                                    />
                                    <div style={{ width: '25px' }}></div>
                                    <Input
                                        placeholder={"City"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"10px"}
                                        width={'95%'}
                                        margin={'0'}
                                        inputValue={userData.shippingData.city}
                                        onInputChange={(e) => handleShippingChange(e, 'city')}
                                        warning={errors.city}
                                    />
                                    <div style={{ width: '25px' }}></div>
                                    <Input
                                        placeholder={"State"}
                                        isVisible={true}
                                        icon={false}
                                        borderRadius={"10px"}
                                        width={'95%'}
                                        margin={'0'}
                                        inputValue={userData.shippingData.state}
                                        onInputChange={(e) => handleShippingChange(e, 'zipCode')}
                                        warning={errors.state}
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
