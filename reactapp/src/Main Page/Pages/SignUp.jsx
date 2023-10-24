import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import '../style.css';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Select from '../Components/Select';
import Captcha from '../Components/Captcha';
import { Link } from "react-router-dom";

const SignUp = () => {
  const [fn, setfn] = useState('');
  const [fnError, setfnError] = useState('');
  const [ln, setln] = useState('');
  const [lnError, setlnError] = useState('');
  const [bd, setbd] = useState('');
  const [bdError, setbdError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setemailError] =useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [confirmError, setconfirmError] = useState('');
  const [captcha, setCaptcha] = useState(false);
  const [country, setCountry] = useState('United States');

  const handelFirstNameChange = (e) => {
    setfnError('');
    setfn(e.target.value);
  }
  const handelLastNameChange = (e) => {
    setlnError('');
    setln(e.target.value);
  }
  const handelBirthdayChange = (e) => {
    setbdError('');
    setbd(e.target.value);
  }
  const handleEmailChange = (e) => {
    setemailError('');
    setEmail(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };
  
  useEffect(() => {
    const lengthRegex = /^.{8,}$/;
    const letterRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    const digitRegex = /\d/;
  
    const hasMinLength = lengthRegex.test(password);
    const hasLetter = letterRegex.test(password);
    const hasDigit = digitRegex.test(password);
  
    setFirst(hasMinLength);
    setSecond(hasLetter);
    setThird(hasDigit);
  }, [password]);
  
  const handleConfirmChange = (e) => {
    setConfirm(e.target.value);
  };
  
  useEffect(() => {
    if (confirm !== password) {
      setconfirmError('The passwords you entered do not match');
    } else {
      setconfirmError('');
    }
  }, [confirm, password]);
  

  const handleRegister = async () => {
    var count = 0;
    if (fn.trim() === '') {
      setfnError('Enter a first name');
    } else {
      setfnError('');
      count++;
    }

    if (ln.trim() === '') {
      setlnError('Enter a last name');
    } else {
      setlnError('');
      count++;
    }
    const currentDate = new Date();
    const selectedDateTime = new Date(bd);
    const minAllowedDate = new Date('1800-01-01');
    if (!bd){
      setbdError('Enter a valid birthday');
    } else if (selectedDateTime > currentDate){
      setbdError('Your birthday must be in the past');
    } else if (selectedDateTime < minAllowedDate){
      setbdError("You're not immortal");
    } else {
      setbdError('');
      count++;
    }
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if(regex.test(email)){
      const response = await fetch(`https://localhost:7061/api/users/${email}?type=${1}`);
      const data = await response.json();
      if (data.status === 404) {
        setemailError('');
        count++;
      }else{
        setemailError('This email address is not available. Choose a different address');
      }
    }else{
      setemailError('Enter a valid email address to use as your Apple ID');
    }
    if(first === true && second === true && third === true){
      count++;
    }else{}
    if(confirm !== password){
      setconfirmError('The passwords you entered do not match')
    }else {
      setconfirmError('');
      count++;
    }
    if(captcha === true){
      count++;
    }
    if(count === 7){
      await fetch('https://localhost:7061/api/Users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: fn,
          LastName: ln,
          Country: country,
          Birthday: bd,
          Email: email,
          Password: password
        }),
      });
      window.location.href = '/signin';
    }else{}
  };
  return (
    <>
      <Navbar darkmode={true} />
      <div style={{width: '100%', borderBottom: '0.5px solid rgb(201, 201, 201)', marginTop: '50px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '67%', margin: 'auto'}}>
                <p style={{color: 'black', fontSize: '25px', fontFamily: 'SF-Pro-Display-Medium', margin: '10px 0'}}>Apple ID</p>
                <Link to='/signin' className='a2'>Sign In</Link>
          </div>
      </div>
      <div className='container display' style={{marginTop: '25px'}}>
        <p className='p2'>Create your Apple ID</p>
        <p className='p2' style={{fontSize: '18px', fontFamily: 'SF-Pro-Display-Medium'}}>One Apple ID is all you need to access all Apple services.</p>
        <div style={{width: '470px', margin: 'auto'}}>
          <div style={{borderBottom: '0.5px solid rgb(201, 201, 201)', paddingBottom: '25px'}}>
              <div style={{display: 'flex', marginTop: '15px', justifyContent: 'space-between'}}>
                  <div style={{width: '48%', display: 'flex', flexWrap: 'wrap'}}>
                    <Input
                      placeholder={"Firstname"}
                      isVisible={true}
                      icon={false}
                      borderRadius={"5px"}
                      error={fnError}
                      onInputChange={handelFirstNameChange}
                    />
                  </div>
                  <div style={{width: '48%', display: 'flex', flexWrap: 'wrap'}}>
                    <Input
                      placeholder={"Lastname"}
                      isVisible={true}
                      icon={false}
                      borderRadius={"5px"}
                      error={lnError}
                      onInputChange={handelLastNameChange}
                    />
                  </div>
              </div>
              <p style={{fontFamily: 'SF-Pro-Display-Medium', fontSize: '15px', margin: '30px 0 5px 0'}}>COUNTRY / REGION</p>
              <Select width={'470px'} type={'countries'} borderRadius={"5px"} onInputChange={handleCountryChange}/>
              <Input type={'date'} placeholder={'Birthday'} isVisible={true} width={'470px'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handelBirthdayChange} error={bdError}/>
          </div>
          <div style={{borderBottom: '0.5px solid rgb(201, 201, 201)', padding: '25px 0'}}>
            <Input placeholder={'name@example.com'} isVisible={true} width={'470px'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handleEmailChange} error={emailError}/>
            <Input placeholder={'Password'} type={'password'} isVisible={true} width={'470px'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handlePasswordChange}/>
            <div>
              <p style={{color: 'black'}}>Your password must have:</p>
              <ul>
                <li style={{color: first ? 'lightgreen' : 'red'}}>8 or more characters</li>
                <li style={{color: second ? 'lightgreen' : 'red'}}>Upper & lower case letters</li>
                <li style={{color: third ? 'lightgreen' : 'red'}}>At least one number</li>
              </ul>
            </div>
            <Input placeholder={'Confirm password'} type={'password'} isVisible={true} width={'470px'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handleConfirmChange} error={confirmError}/>
          </div>
          <div style={{borderBottom: '0.5px solid rgb(201, 201, 201)', padding: '25px 0'}}>
            <Captcha data={setCaptcha} data2={captcha}/>
          </div>
          <button className='btn2' onClick={handleRegister}>Continue</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;