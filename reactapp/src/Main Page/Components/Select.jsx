import React from 'react';

const Select = ({ width, type, borderRadius, onInputChange, selectedValue, margin, customOptions, categoryId, disabled }) => {
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
            case 'status':
                return (
                    <>
                        <option>Inactive</option>
                        <option>Active</option>
                    </>
                )
            case 'category':
                return (
                    <>
                        <option hidden>Select category</option>
                        {customOptions.map((option, index) => (
                            <option key={option.categoryName} value={option.id}>{option.categoryName}</option>
                        ))}
                    </>
                )
            case 'subcategory':
                return (
                    <>
                        <option hidden>Select subcategory</option>
                        {customOptions.map((option, index) => (
                            option.id === categoryId ? option.childCategories.map((child) => (<option key={index} value={child.id}>{child.categoryName}</option>)) : null
                        ))}
                    </>
                )
            default:
                return null;
        }
    };

    return (
        <>
            <div className="input-container" style={{ width: width, margin: margin }}>
                <select
                    className="input"
                    style={{ paddingTop: '0', borderRadius: borderRadius }}
                    onChange={onInputChange}
                    value={selectedValue}
                    disabled={disabled}
                >
                    {renderOptions()}
                </select>
            </div>
        </>
    );
};

export default Select;
