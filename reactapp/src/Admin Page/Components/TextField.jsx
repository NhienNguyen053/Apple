import React, { useState } from 'react';
import TextField2 from '@mui/material/TextField';

const TextField = ({ name }) => {
    const [active, setActive] = useState(false);
    const [inputValue, setInputValue] = useState(name);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleEditClick = () => {
        setActive(true);
    };

    const handleCancelClick = () => {
        setActive(false);
        setInputValue(name);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {active ? (
                <TextField2 id="standard-basic" value={inputValue} variant="standard" onChange={handleInputChange}/>
            ) : (
                <p style={{margin: '0'}}>{inputValue}</p>
            )}
            {active ? (
                <>
                    <div style={{ display: 'flex' }}>
                        <i title="Confirm" className="fa-solid fa-check" style={{ alignSelf: 'center', fontSize: '16px', color: '#b8b8b8', cursor: 'pointer' }}></i>
                        <i title="Cancel" className="fa-solid fa-x" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={handleCancelClick}></i>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <i className="fa-solid fa-pen" title="Edit" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={handleEditClick}></i>
                        <i className="fa-solid fa-trash" title="Delete" style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: 'black', cursor: 'pointer' }}></i>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextField;
