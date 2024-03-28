import React, { useState } from 'react';
import TextField2 from '@mui/material/TextField';

const TextField = ({ id, name, parentId, onClick, onClick2, role }) => {
    const [active, setActive] = useState(false);
    const original = name;
    const [inputValue, setInputValue] = useState(name);
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleEditClick = () => {
        setActive(true);
    };

    const handleCancelClick = () => {
        setActive(false);
        setInputValue(original);
    };

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
                        <i className="fa-solid fa-pen" title="Edit" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={() => { onClick(id, inputValue, parentId); setActive(false); }}></i>
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