import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const NewPassword = () => {
  const API_BASE_URL = process.env.REACT_APP_API_HOST;
  const navigate = useNavigate();
  const location = useLocation();  
  const email = location.state?.email;
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [confirmError, setconfirmError] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
  
  useEffect(() => {
    if (confirm !== password) {
      setconfirmError('The passwords you entered do not match');
    } else {
      setconfirmError('');
    }
  }, [confirm, password]);
  
  const handleConfirmChange = (e) => {
    setConfirm(e.target.value);
  };

  useEffect(() => {
    if (!email) {
      navigate('/notfound');
    }
  }, [email, navigate]);

  const updatepassword = async () => {
      if (first === false || second === false || third === false) { }
      else {
          const encodeEmailorPhone = encodeURIComponent(email)
          const response = await fetch(`${API_BASE_URL}/api/Users/updatePassword?emailorphone=${encodeEmailorPhone}&newPassword=${password}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          if (response.status === 400) { }
          else {
              navigate('/signin');
          }
      }
  }

  return (
    <>
    <Navbar darkmode={false}/>
    <div className='container3' style={{width: '425px'}}>
        <p className='p4' style={{width: '100%'}}>Enter your new password:</p>
        <div style={{width: '100%'}}>
            <Input isVisible={true} placeholder={'Enter new password'} type={'password'} onInputChange={handlePasswordChange} borderRadius={"5px"} paddingRight={'10px'}/>
            <div>
              <p style={{color: 'black'}}>Your password must have:</p>
              <ul>
                <li style={{color: first ? 'lightgreen' : 'red'}}>8 or more characters</li>
                <li style={{color: second ? 'lightgreen' : 'red'}}>Upper & lower case letters</li>
                <li style={{color: third ? 'lightgreen' : 'red'}}>At least one number</li>
              </ul>
            </div>
            <Input isVisible={true} placeholder={'Confirm password'} onInputChange={handleConfirmChange} error={confirmError} type={'password'} borderRadius={"5px"} paddingRight={'10px'}/>
        </div>
        <Button text={'Continue'} margin={'20px 10px'} onclick={updatepassword}/>
    </div>
    <Footer />
    </>
  );
};

export default NewPassword;
