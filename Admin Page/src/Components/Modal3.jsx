import { useState } from 'react';
import Button2 from './Button';
import Input from './Input';

const Modal3 = ({ isVisible, toggleModal, func, text }) => {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');

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
        if (isValid) {
            func(inputValue);
        }
    };

    return (
        <div className="modalBg" style={{ display: isVisible ? 'block' : 'none' }}>
            <div className="modal" style={{ height: inputError ? '235px' : '220px', top: '30%' }}>
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
                    <Button2 text={text} background={'black'} textColor={'white'} onclick={handleAddClick} />
                </div>
            </div>
        </div>
    );
};

export default Modal3;
