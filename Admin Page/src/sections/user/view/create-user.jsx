/* eslint-disable no-control-regex */
import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Input';
import { useNavigate } from "react-router-dom";
import Select from '../../../Components/Select';
import Button from '../../../Components/Button';
import Typography from '@mui/material/Typography';
import '../../../style.css';
import Cookies from 'js-cookie';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------

export default function CreateUser() {
    const [fn, setfn] = useState('');
    const [fnError, setfnError] = useState('');
    const [ln, setln] = useState('');
    const [lnError, setlnError] = useState('');
    const [bd, setbd] = useState('');
    const [bdError, setbdError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setemailError] = useState('');
    const [password, setPassword] = useState('');
    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(false);
    const [third, setThird] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [confirmError, setconfirmError] = useState('');
    const [country, setCountry] = useState('United States');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('Customer');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const jwtToken = Cookies.get('jwtToken');

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

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    }

    const back = () => {
        navigate('/dashboard/users');
    }

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
        setLoading(true);
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
        if (!bd) {
            setbdError('Enter a valid birthday');
        } else if (selectedDateTime > currentDate) {
            setbdError('Your birthday must be in the past');
        } else if (selectedDateTime < minAllowedDate) {
            setbdError("You're not immortal");
        } else {
            setbdError('');
            count++;
        }
        const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (regex.test(email)) {
            const response = await fetch(`https://localhost:7061/api/users/getUser?emailOrPhone=${email}`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 204) {
                setemailError('');
                count++;
            } else {
                setemailError('This email address is not available. Choose a different address');
            }
        } else {
            setemailError('Enter a valid email address to use as your Apple ID');
        }
        if (first === true && second === true && third === true) {
            count++;
        } else { }
        if (confirm !== password) {
            setconfirmError('The passwords you entered do not match')
        } else {
            setconfirmError('');
            count++;
        }
        if (count === 6) {
            await fetch('https://localhost:7061/api/Users/newUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    FirstName: fn,
                    LastName: ln,
                    Country: country,
                    Birthday: bd,
                    Email: email,
                    Password: password,
                    Role: role
                }),
            });
            setLoading(false);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 3000);
        } else {
            setLoading(false);
        }
    };
    return (
        <>
            <Typography variant="h4" sx={{ marginLeft: '3%' }}>New User</Typography>
            <div className='container7 display'>
                <Collapse in={open} sx={{ width: '100%' }}>
                    <Alert sx={{ mb: 2 }}>
                        Created user successfully!
                    </Alert>
                </Collapse>
                <div style={{ width: '48%', margin: 'auto', height: open == false ? '80%' : '70%' }} className="formInputs">
                    <div style={{ paddingBottom: '25px' }}>
                        <Input
                            placeholder={"Firstname"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            error={fnError}
                            width={'100%'}
                            onInputChange={handelFirstNameChange}
                            margin={'0 auto 0 auto'}
                        />
                        <Input
                            placeholder={"Lastname"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            error={lnError}
                            width={'100%'}
                            onInputChange={handelLastNameChange}
                            margin={'15px auto 0 auto'}
                        />
                        <p style={{ fontFamily: 'SF-Pro-Display-Medium', fontSize: '15px', margin: '30px 0 5px 0' }}>COUNTRY / REGION</p>
                        <Select width={'100%'} type={'countries'} borderRadius={"5px"} onInputChange={handleCountryChange} />
                        <Input type={'date'} placeholder={'Birthday'} isVisible={true} width={'100%'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handelBirthdayChange} error={bdError} />
                        <p style={{ fontFamily: 'SF-Pro-Display-Medium', fontSize: '15px', margin: '10px 0 5px 0' }}>ROLE</p>
                        <Select width={'100%'} type={'roles'} borderRadius={"5px"} onInputChange={handleRoleChange} />
                    </div>
                </div>
                <div style={{ width: '48%', margin: '0 auto', height: open == false ? '80%' : '70%' }} className="formInputs">
                    <div style={{ paddingBottom: '25px'}}>
                        <Input placeholder={'name@example.com'} isVisible={true} width={'100%'} margin={'0 auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handleEmailChange} error={emailError} />
                        <Input placeholder={'Password'} type={'password'} isVisible={true} width={'100%'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handlePasswordChange} />
                        <div>
                            <p style={{ color: 'black' }}>Your password must have:</p>
                            <ul>
                                <li style={{ color: first ? 'lightgreen' : 'red' }}>8 or more characters</li>
                                <li style={{ color: second ? 'lightgreen' : 'red' }}>Upper & lower case letters</li>
                                <li style={{ color: third ? 'lightgreen' : 'red' }}>At least one number</li>
                            </ul>
                        </div>
                        <Input placeholder={'Confirm password'} type={'password'} isVisible={true} width={'100%'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handleConfirmChange} error={confirmError} />
                    </div>
                </div>
                <div style={{ display: 'flex', height: 'fit-content', marginLeft: '1%', width: 'fit-content' }} className="formButtons">
                    <Button text={'Back'} onclick={back} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                    <div style={{width: '15px'}}></div>
                    {loading ? (
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    ) : (
                        <Button text={'Continue'} onclick={handleRegister} background={'black'} textColor={'white'} />
                    )}
                </div>
            </div>
        </>
    );
}
