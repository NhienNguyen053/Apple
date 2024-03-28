import React, { useState, useEffect } from "react";
import '../style.css';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';


function NavbarItemSliderContent({ data }) {
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
    }
    const routeChange3 = () => {
        let path = '/dashboard';
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
                    <h1 style={{ marginBottom: '35px', marginLeft: '5px' }}>Your Bag is empty</h1>
                    {jwtToken ? (
                        <p style={{ fontSize: '13px', marginBottom: '35px' }}>
                        <Link to="/signin" style={{ color: '#2372bd' }} className="a1">
                            Shop Now
                        </Link>
                        </p>
                    ) : (
                        <p style={{ fontSize: '13px', marginBottom: '35px' }}>
                        <Link to="/signin" style={{ color: '#2372bd' }} className="a1">
                            Sign In
                        </Link>
                        <span> to see if you have any saved items</span>
                        </p>
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
                    {product && product.childCategories && product.childCategories.map((child) => (
                        <p key={child.id} className="p7">Explore {child.categoryName}</p>
                    ))}
                </div>
            </div>
        );
    }
}

export default NavbarItemSliderContent;
