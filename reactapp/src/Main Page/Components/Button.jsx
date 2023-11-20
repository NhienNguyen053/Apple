import React from 'react';

const Button = ({text, textColor, background, onclick, margin, id}) => {
  return (
    <>
        <button className='btn2' onClick={onclick} style={{color: textColor, background: background, margin: margin}} id={id}>{text}</button>
    </>
  );
};

export default Button;
