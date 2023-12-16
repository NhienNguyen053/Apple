import React, { useState } from 'react';
import TextField2 from '@mui/material/TextField';

const TextField = ({ id, name, parentId, onClick, onClick2 }) => {
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
        <div style={{ display: 'flex', width: '100%', marginBottom: '8px' }}>
            {active ? (
                <TextField2 id="standard-basic" value={inputValue} variant="standard" onChange={handleInputChange}/>
            ) : (
                <p style={{margin: '0'}}>{inputValue}</p>
            )}
            {active ? (
                <>
                    <div style={{ display: 'flex' }}>
                        <i title="Confirm" className="fa-solid fa-check" style={{ alignSelf: 'center', fontSize: '16px', color: '#b8b8b8', cursor: 'pointer' }} onClick={() => { onClick(id, inputValue, parentId); setActive(false); }}></i>
                        <i title="Cancel" className="fa-solid fa-x" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={handleCancelClick}></i>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <i className="fa-solid fa-pen" title="Edit" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={handleEditClick}></i>
                        <i className="fa-solid fa-trash" title="Delete" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: 'black', cursor: 'pointer' }} onClick={() => { onClick2(inputValue, id, "subcategory") }}></i>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextField;