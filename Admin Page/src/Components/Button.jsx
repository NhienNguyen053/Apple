import React from 'react';

const Button = ({height, text, textColor, background, onclick, margin, id, fontSize, border, radius, padding, width, display}) => {
  return (
    <>
        <button className='btn2' onClick={onclick} style={{ justifyContent: 'center', display: display || 'flex', alignItems: 'center', height: height, color: textColor, background: background, margin: margin, fontSize: fontSize, border: border, borderRadius: radius, padding: padding, width: width}} id={id}>{text}</button>
    </>
  );
};

export default Button;
