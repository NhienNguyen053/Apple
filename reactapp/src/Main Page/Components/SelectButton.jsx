import React from 'react';

const SelectButton = ({ buttonId, buttonText, isActive, onToggle }) => {
    const handleClick = () => {
        if (onToggle) {
            onToggle(buttonId, buttonText);
        }
    };

    return (
        <button
            onClick={handleClick}
            style={{ textAlign: 'left', paddingLeft: '20px', fontSize: '16px', fontFamily: 'SF-Pro-Display-Semibold', backgroundColor: 'white', width: '95%', height: '75px', marginBottom: '25px', color: 'black', borderRadius: '10px', cursor: 'pointer', border: isActive ? '2px solid #0071e3' : '1px solid #86868b' }}
        >
            {buttonText}
        </button>
    );
};

export default SelectButton;
