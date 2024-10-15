import { Helmet } from 'react-helmet-async';
import Input from '../Components/Input';
import Button from '../Components/Button';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function Login() {
    const [isChecked, setChecked] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const navigate = useNavigate();

    const handleCheckboxChange = () => {
        setChecked(!isChecked);
    };

    const handelPasswordChange = (e) => {
        setError2('');
        setPassword(e.target.value);
    }
    
    const handleInputChange = (e) => {
        setError('');
        setInputValue(e.target.value);
    };

    const handleclick = async () => {
        if (inputValue.trim() === '') {
            setError('Please enter an email or phone number!');
            if (password.trim() === '') {
                setError2('Please enter a password!');
            }
        }
        else {
            const response = await fetch('https://localhost:7061/api/Users/loginDashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailOrPhone: inputValue,
                    password: password,
                }),
            });
            if (response.status === 200) {
                const data = await response.text();
                if (isChecked === false) {
                    var expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 1);
                    var expirationDateString = expirationDate.toUTCString();
                    document.cookie = `jwtToken=${data}; expires=${expirationDateString}; path=/`;
                    navigate('/dashboard')
                } else {
                    document.cookie = `jwtToken=${data}; expires=${expirationDateString}; path=/`;
                    navigate('/dashboard');
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

    return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <div style={{ width: '100%', display: 'flex', background: '#d0d0d1', height: '100vh' }}>
        <div style={{ width: '25%', margin: 'auto', height: '100vh', background: 'white', display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ width: '100%', justifyContent: 'center', display: 'flex', height: 'fit-content', marginTop: '100px', flexWrap: 'wrap' }}>
                <img src="/apple-logo.png" alt="" style={{ width: '40%', margin: 'auto auto 10px auto' }}/>
                <Input isVisible={true} width={'80%'} placeholder={'Email or Phone Number'} error={error} onInputChange={handleInputChange}/>
                <Input isVisible={true} width={'80%'} margin={'15px 0 0 0'} placeholder={'Password'} error={error2} onInputChange={handelPasswordChange} type={"password"}/>
                <div style={{ width: '80%', margin: '15px auto auto auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" className='checkbox' style={{ borderRadius: '50%' }} onChange={handleCheckboxChange}/>
                        <p style={{ margin: '3px 0 0 0' }}>Remember me</p>
                    </div>
                    <Link to='/resetpassword'>Forgot password?</Link>
                </div>
                <Button width={'80%'} height={'50px'} textColor={'white'} background={'black'} radius={'15px'} text={'Sign In'} onclick={handleclick}/>
            </div>
        </div>
      </div>
    </>
    );
}
