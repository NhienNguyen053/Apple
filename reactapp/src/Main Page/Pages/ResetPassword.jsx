/* eslint-disable no-control-regex */
import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import '../style.css';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Captcha from '../Components/Captcha';
import Button from '../Components/Button';
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [captcha, setCaptcha] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setemailError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setemailError('');
    setEmail(e.target.value);
  }
  
  const handleReset = async () => {
    setLoading(true);
    var count = -1;
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const regex2 = /^\d+$/;
    const regex3 = /^\+\d+$/;

    if(regex.test(email)){
      const response = await fetch(`https://localhost:7061/api/users/${email}?type=${1}`);
      const data = await response.json();
      if (data.status !== 404) {
        setemailError('');
        count++;
      }
      else{
        setemailError("This Apple ID doesn't exist");
      }
    }else if(regex2.test(email)){
      setemailError('Please enter phone number with your international dialing code');
    }else if(regex3.test(email)){
      const response = await fetch(`https://localhost:7061/api/users/${email}?type=${2}`);
      const data = await response.json();
      if (data.status !== 404) {
        setemailError('');
        count = count + 2;
      }
      else{
        setemailError("This phone number isn't linked to any Apple ID");
      }
    }else{
      setemailError('Enter a valid email address or phone number');
    }
    if(captcha === true){
      count++;
    }
    if(count === 1){
      await fetch(`https://localhost:7061/api/users/sendemailotp?receiveEmail=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);
    }
    else if(count === 2){
      const encodedPhoneNumber = encodeURIComponent(email);
      await fetch(`https://localhost:7061/api/Users/send-SMS?phone=${encodedPhoneNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);
    }
    else{
      setLoading(false);
    }
    navigate('/otp', {state: {email: email, type: count}});
  };
  return (
    <>
      <Navbar darkmode={false} />
      <div style={{width: '100%', borderBottom: '0.5px solid rgb(201, 201, 201)', marginTop: '50px'}}>
          <div className='container6'>
                <p className='p6'>Apple ID</p>
                <Link to='/signin' className='a2'>Sign In</Link>
          </div>
      </div>
      <div className='container display' style={{marginTop: '45px', flexWrap: 'nowrap'}}>
        <div style={{width: '60%', borderRight: '0.5px solid rgb(201, 201, 201)', paddingRight: '50px'}}>
            <p style={{color: 'black', fontSize: '35px', fontFamily: 'SF-Pro-Display-Medium', margin: '25px 0'}}>Reset your password</p>
            <p style={{color: 'black', fontSize: '18px', fontFamily: 'SF-Pro-Display-Light', marginTop: '0'}}>Enter your email address or phone number that you use with your account to<br />continue.</p>
            <Input placeholder={'Email or phone number'} isVisible={true} margin={'0'} borderRadius={'5px'} width={'379px'} onInputChange={handleEmailChange} error={emailError}/>
            <Captcha data={setCaptcha} data2={captcha} margin={'15px 0 0 0'}/>
            {loading ? (
              <div class="lds-spinner" style={{margin: '0'}}>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
              </div>
            ) : (
              <Button text={'Continue'} onclick={handleReset} margin={'20px 0'}/>
            )}
        </div>
        <div style={{width: '40%'}}>
            <div style={{display: 'flex', margin: '50px auto', justifyContent: 'center'}}>
                <i class="fa-solid fa-users" style={{color: 'gray', fontSize: '35px', margin: '25px 25px 0 0'}}></i>
                <p style={{fontSize: '16px', fontFamily: 'SF-Pro-Display-Light'}}>You've come to the right place <br />to reset a forgotten password. <br />For your security, we'll ask you a <br />few questions to verify that <br />you're the owner of this <br />account.</p>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;