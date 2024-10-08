import { useState } from 'react';
import Button2 from '../../Main Page/Components/Button';
import Input from '../../Main Page/Components/Input';

const Modal2 = ({ isVisible, toggleModal, func }) => {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setInputError('');
    };

    const handleAddClick = () => {
        if (!inputValue.trim()) { 
            setInputError('Please enter shipping detail!');
        } else {
            func(inputValue);
        }
    };

    return (
        <div className="modalBg" style={{ display: isVisible ? 'block' : 'none' }}>
            <div className="modal" style={{ height: inputError === '' ? '200px' : '225px' }}>
                <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '20px', width: '100%' }}>Add shipping details</p>
                <div style={{ width: '100%' }}>
                    <Input
                        placeholder={"Detail"}
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
                    <Button2 text={'Add'} background={'black'} textColor={'white'} onclick={handleAddClick} />
                </div>
            </div>
        </div>
    );
};

export default Modal2;
