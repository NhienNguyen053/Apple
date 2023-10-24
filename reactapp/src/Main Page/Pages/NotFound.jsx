import React from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';

const NotFound = () => {
  return (
    <>
    <Navbar darkmode={false}/>
    <div style={{width: '50%', margin: 'auto', height: '90vh', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'baseline', marginTop: '125px'}}>
        <p style={{alignSelf: 'center', fontFamily: 'SF-Pro-Display-Medium', color: 'black', fontSize: '40px', textAlign: 'center'}}>The page you're looking for <br />can't be found</p>
        <div><Input placeholder={"Search apple.com"} isVisible={true}/></div>
    </div>
    <Footer />
    </>
  );
};

export default NotFound;
