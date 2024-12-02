import React from 'react';

const Select = ({ width, type, borderRadius, onInputChange, selectedValue, margin, customOptions, categoryId, disabled, selectedCategory, selectedSubCategory, json, warning }) => {
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
                        <option>User Manager</option>
                        <option>Product Manager</option>
                        <option>Order Manager</option>
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
            case 'city/province':
                if (!json) {
                    return <option hidden>Tỉnh/Thành Phố</option>;
                }
                else {
                    return (
                        <>
                            <option hidden>Tỉnh/Thành Phố</option>
                            {json.results.map((province) => (
                                <option key={province.province_id} value={province.province_id} selected={province.province_id === selectedValue}>
                                    {province.province_name}
                                </option>
                            ))}
                        </>
                    );
                }
            case 'district':
                if (!json) {
                    return <option hidden>Quận/Huyện</option>;
                }
                else {
                    return (
                        <>
                            <option hidden>Quận/Huyện</option>
                            {json.results.map((district) => (
                                <option key={district.district_id} value={district.district_id} selected={district.district_id === selectedValue}>
                                    {district.district_name}
                                </option>
                            ))}
                        </>
                    );
                }
            case 'ward':
                if (!json) {
                    return <option hidden>Phường</option>;
                }
                else {
                    return (
                        <>
                            <option hidden>Phường</option>
                            {json.results.map((ward) => (
                                <option key={ward.ward_id} value={ward.ward_id} selected={ward.ward_id === selectedValue}>
                                    {ward.ward_name}
                                </option>
                            ))}
                        </>
                    );
                }
            default:
                return null;
        }
    };

    return (
        <>
            <div className="input-container" style={{ width: width, margin: margin }}>
                <select
                    className="input"
                    style={{
                        paddingTop: '0',
                        borderRadius: borderRadius,
                        border: warning === false || warning == null ? '0.5px solid gray' : '0.5px solid red'
                    }}
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
