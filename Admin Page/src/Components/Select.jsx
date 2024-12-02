import React from 'react';

const Select = ({ width, type, borderRadius, onInputChange, selectedValue, margin, customOptions, categoryId, disabled, selectedCategory, selectedSubCategory,  }) => {
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
                        <option>User Manager</option>
                        <option>Product Manager</option>
                        <option>Order Manager</option>
                        <option>Order Processor</option>
                        <option>Warehouse Staff</option>
                        <option>Shipper</option>
                    </>
                );
            case 'status':
                return (
                    <>
                        <option>Inactive</option>
                        <option>Active</option>
                    </>
                )
            case 'status2': 
                return (
                    <>
                        <option value="">Select status</option>
                        <option>Inactive</option>
                        <option>Active</option>
                    </>
                )
            case 'rows':
                return (
                    <>
                        <option>8</option>
                        <option>16</option>
                        <option>24</option>
                    </>
                )
            case 'category':
                return (
                    <>
                        <option hidden>Select category</option>
                        {customOptions.map((option, index) => (
                            <option key={option.categoryName} value={option.id} selected={option.id === selectedCategory}>{option.categoryName}</option>
                        ))}
                    </>
                )
            case 'subcategory':
                return (
                    <>
                        <option hidden>Select subcategory</option>
                        {customOptions.map((option, index) => (
                            option.id === categoryId ? option.childCategories.map((child) => (<option key={index} value={child.id} selected={child.id === selectedSubCategory}>{child.categoryName}</option>)) : null
                        ))}
                    </>
                )
            case 'warehouse':
                return (
                    <>
                        <option hidden>Select warehouse</option>
                        {customOptions.map((option, index) => (
                            <option key={option.id} value={option.id} selected={option.id === selectedCategory}>{option.name}</option>
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
