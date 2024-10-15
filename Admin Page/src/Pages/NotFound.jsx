import React from 'react';
import Input from '../Components/Input';
import '../style.css';

const NotFound = () => {
  return (
    <>
    <div className='container3'>
        <p className='p5'>The page you're looking<br />for can't be found.</p>
        <div><Input placeholder={"Search apple.com"} isVisible={true}/></div>
    </div>
    </>
  );
};

export default NotFound;
