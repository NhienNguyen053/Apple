import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import '../style.css';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(false);
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [verify, setVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [isChecked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (inputValue.trim() === '') {
        setError('Please enter an email or phone number!');
      } else {
        setError('');
        handleEnterKeyPress();
      }
    }
  };

  const handleKeyPress2 = (event) => {
    if (event.key === 'Enter') {
      if (password.trim() === '') {
        setError2('Please enter a password!');
      } else {
        setError2('');
        handleEnterKeyPress2();
      }
    }
  };

  const handleVerificationLinkClick = async () => {
    try {
        await fetch(`https://localhost:7061/api/Users/resendemail?email=${encodeURIComponent(inputValue)}`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error calling API:', error);
    }
  };

  const handleEnterKeyPress = async () => {
    try {
      const numericRegex = /^[0-9]+$/;
      var typeRegister;
      if (numericRegex.test(inputValue) == true) {
        typeRegister = 2;
      } else {
        typeRegister = 1;
      }
      const response = await fetch(`https://localhost:7061/api/users/${inputValue}?type=${typeRegister}`);
      const data = await response.json();
      if (data.status === 404) {
        setError("Email or phone number isn't registered!");
        setVerify(false);
        setUser(false);
      }else if (data.verifiedAt == null){
        setError('');
        setVerify(true);
        setUser(false);
      }
      else {
        setError('');
        setVerify(false);
        setUser(true);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEnterKeyPress2 = async () => {
    try {
      const numericRegex = /^[0-9]+$/;
      var typeRegister;
      if (numericRegex.test(inputValue) == true) {
        typeRegister = 2;
      } else {
        typeRegister = 1;
      }
      const response = await fetch('https://localhost:7061/api/Users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: inputValue,
          password: password,
          typeRegister: typeRegister,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        if(isChecked === false){
          var expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);      
          var expirationDateString = expirationDate.toUTCString();      
          document.cookie = `jwtToken=${data.token}; expires=${expirationDateString}; path=/`;      
          navigate('/')
          setError2('');
        }else{
          document.cookie = `jwtToken=${data.token}; expires=${expirationDateString}; path=/`;      
          navigate('/');
          setError2('');
        }
      }
    } catch (error) {
      setError2('Incorrect password!');
    }
  };
  

  const handelPasswordChange = (e) => {
    setError2('');
    setPassword(e.target.value);
  }

  const handleInputChange = (e) => {
    setError('');
    setInputValue(e.target.value);
    setVerify(false);
    setUser(false);
  };

  return (
    <>
      <Navbar darkmode={false} />
      <div className='container display'>
        <h1 className='h1'>Sign in for faster checkout</h1>
        <p className='p1'>Sign in to Apple Store</p>
        <div style={{width: '419px',height: '112px', margin: 'auto'}}>
          <Input
            placeholder={"Email or Phone Number"}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onKeyPress={handleKeyPress}
            isVisible={true}
            error={error}
            borderRadius={user? "10px 10px 0 0" : "10px"}
            buttonClick={handleEnterKeyPress}
            type={"text"}
            icon={true}
          />
          <p style={{display: verify ? 'block' : 'none', margin: '8px 0 0 3px'}}>Your account isn't verified. <a href='' onClick={handleVerificationLinkClick}>Click here</a> to send verification email!</p>
          <Input 
            placeholder={"Password"} 
            isVisible={user} 
            borderRadius={"0 0 10px 10px"} 
            borderTop={"none"} 
            onInputChange={handelPasswordChange}
            onKeyPress={handleKeyPress2}
            buttonClick={handleEnterKeyPress2}
            error={error2}
            type={"password"}
            icon={true}
          />
        </div>
        <div className='container1'>
          <input type="checkbox" className='checkbox' onChange={handleCheckboxChange}/>
          <p>Remember me</p>
          <br />
          <div style={{width: '100%', display: 'flex'}}>
            <Link to='/resetpassword' style={{marginTop: '10px'}}>Forgot password?</Link>
          </div>
          <br />
          <p style={{marginTop: '9px', fontFamily: 'SF-Pro-Display-Light', fontSize: '16px'}}>Don't have an Apple ID? <Link to='/signup'>Create yours now.</Link></p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
