import React, { useState, useEffect } from "react";
import '../style.css';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Button from './Button';

function NavbarItemSliderContent({ data, cartItems }) {
    const [product, setProduct] = useState({});

    useEffect(() => {
        if (data) {
            setProduct(data);
        }
    }, [data]);

    let navigate = useNavigate(); 
    const routeChange = () => {
        let path = `/signin`; 
        navigate(path);
    }
    const routeChange2 = () => {
        Cookies.remove('jwtToken');
        let path = `/`; 
        navigate(path);
        window.location.reload();
    }
    const routeChange3 = () => {
        let path = '/dashboard';
        navigate(path);
    }
    const routeChange4 = (name) => {
        let formattedName = name.replace(/\s+/g, '-');
        let path = `/${formattedName.toLowerCase()}`;
        navigate(path);
    }
    const routeChange5 = () => {
        let path = `/cart`;
        navigate(path);
    }
    const jwtToken = Cookies.get('jwtToken');
    var decodedToken;
    if(jwtToken != null){
        decodedToken = jwt_decode(jwtToken);
    }
    if (data === 'shopping-bag') {
        return (
            <div className="container">
                <div className="slidercontent">
                    {cartItems.length === 0 ? (
                        <>
                            <h1 style={{ marginBottom: '35px', marginLeft: '5px' }}>Your Bag is empty</h1>
                            {jwtToken ? null : (
                                <p style={{ fontSize: '13px', marginBottom: '35px' }}>
                                    <Link to="/signin" style={{ color: '#2372bd' }} className="a1">
                                        Sign In
                                    </Link>
                                    <span> to see if you have any saved items</span>
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between', cursor: 'default'}}>
                                <h1>Bag</h1>
                                <Button background={'#0071e3'} text={"Review Cart"} radius={'20px'} fontSize={'16px'} margin={'auto 0'} onclick={routeChange5}/>
                            </div>
                            {cartItems.map((item) => (
                                <div style={{ width: '90%', display: 'flex', marginBottom: '20px' }}>
                                    {item.image ? <div style={{ width: '75px', height: '75px' }}>
                                        <img src={item.image} style={{ borderRadius: '10px', width: '100%', height: '100%', objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
                                    </div> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '75px', width: '75px', background: '#f6f5f8', borderRadius: '10px' }}>
                                        <p style={{ textAlign: 'center' }}>No images available</p>
                                    </div>}
                                    <p style={{ margin: 'auto 0 auto 20px', fontSize: '16px' }}>{item.name}</p>
                                </div>
                            ))}
                        </>
                    )}
                    <p style={{ fontSize: '13px', marginBottom: '10px' }}>My Profile</p>
                    {decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' ? (
                        <div className="hoverable-div" onClick={routeChange3}>
                            <i className="fa-solid fa-chart-simple"></i>
                            <p>Dashboard</p>
                        </div>
                    ) : (
                        <>
                            {/* Empty block */}
                        </>
                    )}
                    <div className="hoverable-div">
                        <i className="fa-solid fa-box-open"></i>
                        <p>Orders</p>
                    </div>
                    <div className="hoverable-div">
                        <i className="fa-solid fa-tag"></i>
                        <p>Your Saves</p>
                    </div>
                    <div className="hoverable-div">
                        <i className="fa-solid fa-gear"></i>
                        <p>Account</p>
                    </div>
                    {jwtToken ? (
                        <div className="hoverable-div" onClick={routeChange2}>
                            <i className="fa-solid fa-user"></i>
                            <p>Sign Out {decodedToken == null ? "" : decodedToken['FirstName']}</p>
                        </div>
                    ) : (
                        <div className="hoverable-div" onClick={routeChange}>
                            <i className="fa-solid fa-user"></i>
                            <p>Sign In</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }else if(data === 'search'){
        return(
            <div className="container" style={{alignItems: 'baseline'}}>
                <i className="fa-solid fa-magnifying-glass" style={{color: 'gray', marginRight: '20px', fontSize: '20px'}}></i>
                <input type="text" placeholder="Search apple.com" style={{backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'gray', fontSize: '20px'}}/>
            </div>
        );
    }else{
        return (
            <div style={{ width: '60%', margin: '10px auto' }}>
                <div className="slidercontent">
                    <p style={{ margin: '5px 0 10px 0' }}>Explore {product.categoryName}</p>
                    <p className="p7" onClick={() => routeChange4(product.categoryName)}>Explore All {product.categoryName}</p>
                    {product && product.childCategories && product.childCategories.map((child) => (
                        <p key={child.id} className="p7" onClick={() => routeChange4(child.categoryName)}>Explore {child.categoryName}</p>
                    ))}
                </div>
            </div>
        );
    }
}

export default NavbarItemSliderContent;
