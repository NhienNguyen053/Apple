import React from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';

const NotFound = () => {
  return (
    <>
    <Navbar darkmode={false}/>
    <div className='container3'>
        <p className='p5'>The page you're looking<br />for can't be found.</p>
        <div><Input placeholder={"Search apple.com"} isVisible={true}/></div>
    </div>
    <Footer />
    </>
  );
};

export default NotFound;
