import React, { useState, useRef } from 'react';

const DigitInput = ({setInput}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const sanitizeInput = (input) => input.replace(/[^0-9]/g, '');

  const handleChange = (index, value) => {
    const sanitizedValue = sanitizeInput(value);
    const newDigits = [...digits];
    newDigits[index] = sanitizedValue;
    setDigits(newDigits);
    setInput(newDigits);

    if (sanitizedValue !== '' && index < digits.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && digits[index] === '') {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      setInput(newDigits)
      inputRefs.current[index - 1].focus();
    }
    
    if (e.key === 'Delete' && index > 0 && digits[index] === '' && digits[index - 1] !== '') {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      setInput(newDigits);
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div>
      {digits.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className='input2'
        />
      ))}
    </div>
  );
};

export default DigitInput;
