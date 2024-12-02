import React from 'react';
import Button from '../Components/Button';
import '../style.css';
import { useNavigate } from "react-router-dom";


const NotFound = () => {
  let navigate = useNavigate();

  const routeChange = () => {
      let path = `/login`;
      navigate(path);
  }

  return (
    <>
    <div className='container3'>
        <p className='p5'>The page you're looking<br />for can't be found.</p>
        <Button
            background={'#0071e3'}
            onclick={routeChange}
            text={"Back to login"}
            radius={'10px'}
            fontSize={'16px'}
            margin={'0 auto 100px auto'}
            width={'300px'}
        />
    </div>
    </>
  );
};

export default NotFound;
