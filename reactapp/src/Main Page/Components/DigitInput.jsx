import React, { useState } from 'react';

const DigitInput = () => {
  const [digits, setDigits] = useState(['', '', '', '', '']);

  const handleInputChange = (index, value, event) => {
    if (event.keyCode === 8 && value === '' && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);  
      document.getElementById(`digit-input-${index - 1}`).focus();
    } else if (/^\d*$/.test(value)) {
      const newDigits = [...digits];
      newDigits[index] = value;
  
      if (value !== '' && index < 4) {
        document.getElementById(`digit-input-${index + 1}`).focus();
      }
  
      setDigits(newDigits);
    }
  };
  
  return (
    <div>
      {digits.map((digit, index) => (
        <input
            key={index}
            type="text"
            id={`digit-input-${index}`}
            maxLength="1"
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value, e)}
            onKeyDown={(e) => handleInputChange(index, digit, e)}
            className='input2'
        />
      ))}
    </div>
  );
};

export default DigitInput;
