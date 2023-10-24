import Input from './Input';
import React, { useState, useEffect, useRef } from 'react';

const Captcha = ({ data, data2, width, margin }) => {
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const [captchaText, setCaptchaText] = useState(generateRandomString(5));
  const canvasRef = useRef(null);
  const [userInput, setUserInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    handleSubmit();
  }, [data2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawDistortedText(context, captchaText);
  }, [captchaText]);

  const drawDistortedText = (context, text) => {
    context.font = '30px Arial';
    context.fillStyle = 'black';
    context.fillText(distortText(text), 10, 40);
  };

  const distortText = (text) => {
    return text.split('').map((char) => char + ' ').join('');
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    setError(''); 
  };

  const handleSubmit = () => {
    const isInputValid = userInput === captchaText;
    setIsCaptchaValid(isInputValid);
    if (!isInputValid) {
      setError('Please enter correct captcha');
      data('false');
    }else{
      data('true');
    }
  };
  
  const handleReset = () => {
    const newRandomString = generateRandomString(5);
    setCaptchaText(newRandomString);
    setUserInput('');
    setIsCaptchaValid(false);
    setError('');
  };

  return (
    <div style={{display: 'flex', margin: margin}}>
      <div style={{width: '100%', marginRight: '30px'}}>
          <Input placeholder={'Type the characters in the image'} isVisible={true} width={width ? width : '100%'} margin={margin} borderRadius={'5px'} onInputChange={handleInputChange}/>
          <button className='captcha' onClick={handleReset}>New Code</button>
          <button className='captcha' onClick={handleSubmit}>Submit</button>
          {error && <p style={{ color: 'red', margin: '5px 0 0 5px' }}>{error}</p>}
          {isCaptchaValid && <p style={{ color: 'green', margin: '5px 0 0 5px' }}>Captcha is valid!</p>}
      </div>
      <br />
      <canvas ref={canvasRef} width={150} height={56} style={{ border: '1px solid #000', height: '56px', margin: margin }}></canvas>
    </div>
  );
};

export default Captcha;
