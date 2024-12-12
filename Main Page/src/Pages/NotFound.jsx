import React from 'react';
import Navbar from '../Components/Navbar';
import Button from '../Components/Button';
import Footer from '../Components/Footer';
import ViewportWidth from '../Components/ViewportWidth';
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const viewportWidth = ViewportWidth();
  let navigate = useNavigate();

  const home = () => {
      navigate('/');
  }

  return (
    <>
    <Navbar darkmode={false}/>
    <div className='container3' style={{width: viewportWidth > 1050 ? '50%' : '90%'}}>
        <p className='p5'>The page you're looking<br />for can't be found.</p>
        <div><Button onclick={home} height={'40px'} text={'Back to home page'} background={'black'}/></div>
    </div>
    <Footer />
    </>
  );
};

export default NotFound;
