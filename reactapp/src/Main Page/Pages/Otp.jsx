import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import DigitInput from '../Components/DigitInput';
import Button from '../Components/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  
  const email = location.state?.email;
  const type = location.state?.type;
  const [error, setError] = useState('');

  const back = () => {
    navigate('/resetpassword');
  }

  const confirmotp = async () => {
    var otp2 = otp.toString().replace(/,/g, '');    

    if (otp2.length !== 6) {
      setError('Please enter the full otp!');
    } else {
      const encodedPhoneNumber = encodeURIComponent(email);
      const response = await fetch(`https://localhost:7061/api/Users/confirmotp?otp=${otp2}&emailorphone=${encodedPhoneNumber}&type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.text();
      if(response.status === 400){
        setError(data);
      }else{
        setError('');
        navigate('/newpassword', {state: {email: email}});
      }
    }
  }

  const resend = async () => {
    if(type === 1){
      await fetch(`https://localhost:7061/api/users/sendemailotp?receiveEmail=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    else if(type === 2){
      const encodedPhoneNumber = encodeURIComponent(email);
      await fetch(`https://localhost:7061/api/Users/sendSMS?phone=${encodedPhoneNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  useEffect(() => {
    if (!email) {
      navigate('/notfound');
    }
  }, [email, navigate]);

  return (
    <>
      <Navbar darkmode={false}/>
      <div className='container3'>
        <p className='p4'>The verification code has been sent to <span style={{fontFamily: 'SF-Pro-Display-Medium', color: 'black'}}>{location.state?.email}</span>. <br />Please enter the code here:</p>
        <div className='container4'>
          <DigitInput setInput={setOtp}/>
          <p style={{display: error ? 'block' : 'none', color: 'red', width: '100%',textAlign: 'center', fontSize: '18px'}}>{error}</p>
        </div>
        <p className='p3' onClick={resend}>Send a new code</p>
        <div style={{display: 'flex'}}>
          <Button text={'Back'} margin={'20px 10px'} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'#0071e3'} onclick={back} id={'btn2'}/>
          <Button text={'Next'} margin={'20px 10px'} onclick={confirmotp}/>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Otp;
