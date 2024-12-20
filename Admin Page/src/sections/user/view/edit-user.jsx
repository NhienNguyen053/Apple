/* eslint-disable no-control-regex */
import React, { useState, useEffect } from 'react';
import Input from '../../../Components/Input';
import { useNavigate, useLocation } from "react-router-dom";
import Select from '../../../Components/Select';
import Button from '../../../Components/Button';
import Typography from '@mui/material/Typography';
import '../../../style.css';
import Collapse from '@mui/material/Collapse';
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';
const { format, parseISO } = require("date-fns");

// ----------------------------------------------------------------------

export default function EditUser() {
    const API_BASE_URL = process.env.REACT_APP_API_HOST;
    const location = useLocation();
    const id = location.state?.id;
    const jwtToken = Cookies.get('jwtToken');
    const [fn, setfn] = useState('');
    const [fnError, setfnError] = useState('');
    const [ln, setln] = useState('');
    const [lnError, setlnError] = useState('');
    const [bd, setbd] = useState('');
    const [bdError, setbdError] = useState('');
    const [country, setCountry] = useState('United States');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('Customer');
    const [open, setOpen] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [warehouse, setWarehouse] = useState('');
    const [warehouseError, setWarehouseError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        getUser();
    }, []);

    const getWarehouses = async () => {
        const response = await fetch(`${API_BASE_URL}/api/Warehouse/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            setWarehouses(data);
        }
    }

    const getUser = async () => {
        const response = await fetch(`${API_BASE_URL}/api/Users/getUserById?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${jwtToken}`
            },
        });
        const data = await response.json();
        setfn(data.firstName);
        setln(data.lastName);
        setbd(data.birthday);
        setRole(data.role);
        if (data.role !== 'User Manager' && data.role !== 'Product Manager') {
            getWarehouses();
            setWarehouse(data.warehouseId);
        }
        setCountry(data.country);
        const parsedDate = parseISO(data.birthday);
        const formattedDate = format(parsedDate, "yyyy-MM-dd");
        setbd(formattedDate);
    }

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
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        if (e.target.value === 'Order Manager' || e.target.value === 'Order Processor' || e.target.value === 'Warehouse Staff' || e.target.value === 'Shipper') {
            getWarehouses();
        } else {
            setWarehouses([]);
        }
    }

    const handleWarehouseChange = (e) => {
        setWarehouseError('');
        setWarehouse(e.target.value);
    }

    const back = () => {
        navigate('/dashboard/users');
    }

    const handleUpdate = async () => {
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
        if (warehouse === '') {
            setWarehouseError('Please select a warehouse!');
        } else {
            setWarehouseError('');
            count++;
        }
        if ((count === 3 && (role === 'User Manager' || role === 'Product Manager')) || (count === 4 && (role !== 'User Manager' && role !== 'Product Manager'))) {
            await fetch(`${API_BASE_URL}/api/Users/updateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: id,
                    FirstName: fn,
                    LastName: ln,
                    Country: country,
                    Birthday: bd,
                    Role: role,
                    WarehouseId: warehouse
                }),
            });
            setLoading(false);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000);
        } else {
            setLoading(false);
        }
    };
    return (
        <>
            <Typography variant="h4" style={{ marginLeft: '3%' }}>Edit User</Typography>
            <div className='container7 display'>
                <Collapse in={open} sx={{ width: '100%' }}>
                    <Alert sx={{ mb: 2 }}>
                        Updated user successfully!
                    </Alert>
                </Collapse>
                <div style={{ width: '98%', margin: 'auto', height: open == false ? '80%' : '70%' }}>
                    <div style={{ width: '50%' }} className="formInputs2">
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
                                inputValue={fn}
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
                                inputValue={ln}
                            />
                            <p style={{ fontFamily: 'SF-Pro-Display-Medium', fontSize: '15px', margin: '30px 0 5px 0' }}>COUNTRY / REGION</p>
                            <Select width={'100%'} type={'countries'} borderRadius={"5px"} onInputChange={handleCountryChange} selectedValue={country} />
                            <Input type={'date'} placeholder={'Birthday'} isVisible={true} width={'100%'} margin={'15px auto 0 auto'} borderRadius={"5px"} paddingRight={'10px'} onInputChange={handelBirthdayChange} error={bdError} inputValue={bd} />
                            <p style={{ fontFamily: 'SF-Pro-Display-Medium', fontSize: '15px', margin: '10px 0 5px 0' }}>ROLE</p>
                            <Select width={'100%'} type={'roles'} borderRadius={"5px"} onInputChange={handleRoleChange} selectedValue={role} />
                            <div style={{ display: warehouses.length === 0 ? 'none' : 'block', marginBottom: '10px' }}>
                                <p style={{ fontFamily: 'SF-Pro-Display-Medium', fontSize: '15px', margin: '15px 0 5px 0' }}>WAREHOUSE</p>
                                <Select width={'100%'} type={'warehouse'} borderRadius={'5px'} customOptions={warehouses} onInputChange={handleWarehouseChange} selectedCategory={warehouse} />
                                <p style={{ display: warehouseError === '' ? 'none' : 'block', color: 'red', margin: '10px 0 0 0', fontSize: '16px' }}>{warehouseError}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', height: 'fit-content', marginLeft: '1%', width: 'fit-content' }} className="formButtons">
                    <Button text={'Back'} onclick={back} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                    <div style={{ width: '15px' }}></div>
                    {loading ? (
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    ) : (
                        <Button text={'Continue'} onclick={handleUpdate} background={'black'} textColor={'white'} />
                    )}
                </div>
            </div>
        </>
    );
}
