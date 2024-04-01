import React, { useState } from 'react';
import TextField2 from '@mui/material/TextField';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

const TextField = ({ id, name, parentId, onClick, onClick2, role, isActive }) => {
    const jwtToken = Cookies.get('jwtToken');
    const [active, setActive] = useState(isActive);
    const [originalValue] = useState(name);
    const [inputValue, setInputValue] = useState(name);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const updateSubCategory = async (id, name, parentId) => {
        const result = await fetch('https://localhost:7061/api/Category/updateCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                Id: id,
                CategoryName: name,
                Description: null,
                VideoURL: null,
                ParentCategoryId: parentId
            }),
        });
        if (result.status === 400) {
            const error = await result.text();
            setInputValue(originalValue);
            onClick(result.status, error);
        } 
    }

    return (
        <div style={{ display: role === 'Admin' ? 'flex' : 'none', width: '100%', marginBottom: '8px' }}>
            {active ? (
                <TextField2 id="standard-basic" value={inputValue} variant="standard" onChange={handleInputChange}/>
            ) : (
                <p style={{ margin: '0', cursor: 'pointer' }} onClick={() => setActive(true)}>{inputValue}</p>
            )}
            {active ? (
                <>
                    <div style={{ display: 'flex' }}>
                        <i className="fa-solid fa-pen" title="Edit" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={() => { updateSubCategory(id, inputValue, parentId); setActive(false); }}></i>
                        <i className="fa-solid fa-trash" title="Delete" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: 'black', cursor: 'pointer' }} onClick={() => { onClick2(inputValue, id, "subcategory") }}></i>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default TextField;