import React from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import { useNavigate } from "react-router-dom";

const Failed = () => {
    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/cart`;
        navigate(path);
    }

    return (
        <>
            <Navbar darkmode={false} />
            <div className='container3'>
                <p className='p5'>Payment failed<br />Please try again!</p>
                <Button background={'#0071e3'} onclick={routeChange} text={"View Cart"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} />
            </div>
            <Footer />
        </>
    );
};

export default Failed;
