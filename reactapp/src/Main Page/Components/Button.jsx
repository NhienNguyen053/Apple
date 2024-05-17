import React from 'react';

const Button = ({text, textColor, background, onclick, margin, id, fontSize, border, radius, padding, width}) => {
  return (
    <>
        <button className='btn2' onClick={onclick} style={{ justifyContent: 'center', color: textColor, background: background, margin: margin, fontSize: fontSize, border: border, borderRadius: radius, padding: padding, width: width}} id={id}>{text}</button>
    </>
  );
};

export default Button;
