import { useState } from 'react';
import Button2 from './Button';
import Input from './Input';

const Modal3 = ({ isVisible, toggleModal, func }) => {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectError, setSelectError] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setSelectError('');
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setInputError('');
    };

    const handleAddClick = () => {
        let isValid = true;
        if (!inputValue.trim()) {
            setInputError('Please enter description!');
            isValid = false;
        } else {
            setInputError('');
        }

        if (!selectedOption.trim()) {
            setSelectError('Please choose pickup address!');
            isValid = false;
        } else {
            setSelectError('');
        }

        if (isValid) {
            func(inputValue, selectedOption);
        }
    };

    return (
        <div className="modalBg" style={{ display: isVisible ? 'block' : 'none' }}>
            <div className="modal" style={{ height: inputError || selectError ? (inputError && selectError ? '350px' : '325px') : '300px', top: '30%' }}>
                <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '20px', width: '100%', margin: '15px 0' }}>Choose pickup address</p>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="radio"
                        value="Cau Giay, Ha Noi"
                        checked={selectedOption === 'Cau Giay, Ha Noi'}
                        onChange={handleOptionChange}
                        style={{ width: '16px', height: '16px', margin: 0 }}
                    />
                    <p style={{ color: 'black', margin: '0 0 0 10px' }}>Cau Giay, Ha Noi</p>
                </div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <input
                        type="radio"
                        value="Hoang Mai, Ha Noi"
                        checked={selectedOption === 'Hoang Mai, Ha Noi'}
                        onChange={handleOptionChange}
                        style={{ width: '16px', height: '16px', margin: 0 }}
                    />
                    <p style={{ color: 'black', margin: '0 0 0 10px' }}>Hoang Mai, Ha Noi</p>
                </div>
                <p style={{ color: 'red', margin: 0, display: selectError === "" ? 'none' : 'block', margin: '10px 0 0 0' }}>{selectError}</p>
                <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '20px', width: '100%' }}>Add details</p>
                <div style={{ width: '100%' }}>
                    <Input
                        placeholder={"Description"}
                        isVisible={true}
                        icon={false}
                        borderRadius={"5px"}
                        width={'50%'}
                        margin={'0'}
                        value={inputValue}
                        onInputChange={handleInputChange}
                        error={inputError}
                    />
                </div>
                <div style={{ display: 'flex', width: 'fit-content', height: 'fit-content' }}>
                    <Button2 text={'Back'} onclick={toggleModal} background={'white'} textColor={'black'} margin={'20px 10px 20px 0'} />
                    <Button2 text={'Processing'} background={'black'} textColor={'white'} onclick={handleAddClick} />
                </div>
            </div>
        </div>
    );
};

export default Modal3;
