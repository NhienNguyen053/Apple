import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import '../style.css';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import ViewportWidth from '../Components/ViewportWidth';

const SignIn = () => {
  const API_BASE_URL = process.env.REACT_APP_API_HOST;
  const viewportWidth = ViewportWidth();
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(false);
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [verify, setVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

    useEffect(() => {
        const isRegister = async () => {
            window.scrollTo(0, 0);
            const email = location.state?.email;
            if (email) {
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
                setInputValue(email);
                setUser(true);
            }
        };
        isRegister();
    }, []);

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
        await fetch(`${API_BASE_URL}/api/Users/resendEmail?email=${encodeURIComponent(inputValue)}`, {
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
      if (inputValue.trim() === '') {
        setError('Please enter an email or phone number!');
      }
      else {
          const response = await fetch(`${API_BASE_URL}/api/users/getUser?emailOrPhone=${inputValue}`, {
              method: 'POST',
              headers: {
                  'Accept': '*/*',
                  'Content-Type': 'application/json',
              },
          });
          const data = await response.text();
          if (response.status === 204) {
              setError("Email or phone number isn't registered!");
              setVerify(false);
              setUser(false);
          } else if (data === "User not verified!") {
              setError('');
              setVerify(true);
              setUser(false);
          }
          else {
              setError('');
              setVerify(false);
              setUser(true);
          }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEnterKeyPress2 = async () => {
      if (password.trim() === '') {
        setError2('Please enter a password!');
      }
      else {
          const response = await fetch(`${API_BASE_URL}/api/Users/login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  emailOrPhone: inputValue,
                  password: password,
              }),
          });
          if (response.ok) {
              const data = await response.text();
              if (isChecked === false) {
                  var expirationDate = new Date();
                  expirationDate.setDate(expirationDate.getDate() + 1);
                  var expirationDateString = expirationDate.toUTCString();
                  document.cookie = `jwtToken=${data}; expires=${expirationDateString}; path=/`;
                  navigate('/')
                  setError2('');
              } else {
                  document.cookie = `jwtToken=${data}; expires=${expirationDateString}; path=/`;
                  navigate('/');
                  setError2('');
              }
          }
          else if (response.status === 204) {
              setError2("User doesn't exist!");
          }
          else if (response.status === 401) {
              setError2("Account not verified!");
          }
          else {
              setError2('Incorrect Password!');
          }
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
      <Collapse in={open} sx={{ right: '10px', top: '10px', zIndex: 1000, position: 'absolute' }}>
          <Alert sx={{ mb: 2 }} severity="success">
              Verification link has been sent. Please check your email!
          </Alert>
      </Collapse>
      <div className='container display' style={{width: viewportWidth > 625 ? '67%' : '90%'}}>
        <h1 className='h1' style={{fontSize: viewportWidth > 625 ? '38px' : '30px'}}>Sign in for faster checkout</h1>
        <p className='p1'>Sign in to Apple Store</p>
        <div style={{width: viewportWidth > 625 ? '419px' : '350px',height: '112px', margin: 'auto'}}>
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
            width={viewportWidth > 625 ? null : '350px'}
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
            width={viewportWidth > 625 ? null : '350px'}
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
