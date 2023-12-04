import React from 'react';

const Select = ({ width, type, borderRadius, onInputChange, selectedValue }) => {
    const renderOptions = () => {
        switch (type) {
            case 'countries':
                return (
                    <>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Vietnam</option>
                    </>
                );
            case 'roles':
                return (
                    <>
                        <option>Customer</option>
                        <option>Employee</option>
                        <option>Admin</option>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="input-container" style={{ width: width }}>
                <select
                    className="input"
                    style={{ paddingTop: '0', borderRadius: borderRadius }}
                    onChange={onInputChange}
                    value={selectedValue}
                >
                    {renderOptions()}
                </select>
            </div>
        </>
    );
};

export default Select;
