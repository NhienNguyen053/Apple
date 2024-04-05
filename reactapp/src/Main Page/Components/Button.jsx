import React from 'react';

const Button = ({text, textColor, background, onclick, margin, id, fontSize, border, radius, padding}) => {
  return (
    <>
        <button className='btn2' onClick={onclick} style={{color: textColor, background: background, margin: margin, fontSize: fontSize, border: border, borderRadius: radius, padding: padding}} id={id}>{text}</button>
    </>
  );
};

export default Button;
