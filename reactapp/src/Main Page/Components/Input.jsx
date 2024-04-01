import React from 'react';

const Input = ({ accept, color, placeholder, inputValue, onInputChange, onKeyPress, isVisible, error, borderRadius, borderTop, buttonClick, type, icon, width, margin, paddingRight, id, errorMargin, multiple, disabled }) => {
  return (
    <>
      <div className="input-container" style={{display: isVisible ? 'block' : 'none', width: width, margin: margin}}>
        <input
          className='input'
          type={type}
          placeholder=" "
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyPress}
          style={{ borderRadius: borderRadius, borderTop: borderTop, paddingRight: paddingRight, color: color }}
          id={id}
          accept={accept || "image/png, image/gif, image/jpeg"}
          multiple={multiple}
          disabled={disabled}
        />
        <label style={{width: '220px'}}>{placeholder}</label>
        <button className="btn1" onClick={buttonClick} style={{display: icon ? 'block' : 'none'}}>
          <i className="fa-solid fa-right-long"></i>
        </button>
      </div>
      <p style={{color: 'red', margin: errorMargin == null ? '8px 0 0 0' : errorMargin, display: error === "" ? 'none' : 'block'}}>{error}</p>
    </>  
  );
};

export default Input;
