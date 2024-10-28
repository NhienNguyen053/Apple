import { useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar';
import Input from '../Components/Input';
import Footer from '../Components/Footer';
import Button from '../Components/Button';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from "react-router-dom";
import jwt_decode from 'jwt-decode';

const Result = () => {
    let navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const resultCode = searchParams.get('resultCode');
    const message = searchParams.get('message');
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;

    const routeChange = () => {
        let path = `/`;
        navigate(path);
    }
    // remove this when momo ipn work
    const hasCalledApi = useRef(false);
    useEffect(() => {
        const sendMomoIPN = async () => {
            if (hasCalledApi.current) return;
            hasCalledApi.current = true;

            const momoIPN = {
                OrderId: orderId,
                UserId: decodedToken ? decodedToken["Id"] : null,
                ResultCode: resultCode
            };
            const response = await fetch('https://localhost:7061/api/Momo/redirectMomo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(momoIPN),
            });
            if (response.status === 400) {
                navigate("/notfound");
            } else { }
        };
        sendMomoIPN();
    }, [orderId, decodedToken]);
    return (
        <>
            <Navbar darkmode={false} removeCart={resultCode === 0 ? true : false} delay={resultCode === 0 ? true : false} />
            {resultCode == 0 ? (
                <>
                    <div className='container3'>
                        <p className='p5'>Payment success
                            <p style={{ fontFamily: 'SF-Pro-Display-Light', fontSize: '20px', color: 'black' }}>
                                Please check your Email account to view your order details!
                            </p>
                        </p>
                        <Button
                            background={'#0071e3'}
                            onclick={routeChange}
                            text={"Continue Shopping"}
                            radius={'10px'}
                            fontSize={'16px'}
                            margin={'0 auto 100px auto'}
                            width={'300px'}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className='container3'>
                        <p className='p5'>{message}</p>
                        <Button background={'#0071e3'} onclick={routeChange} text={"View Cart"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} />
                    </div>
                </>
            )}
            <Footer />
        </>
    );
};

export default Result;
