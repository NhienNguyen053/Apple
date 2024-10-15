import React, { useEffect, useState } from 'react';
import '../style.css';

const ImageContainer = ({ parentMargin, parentWidth, height, icon, imageUrl, isTop, textColor, firstText, secondText, thirdText, fourthText, className }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: parentMargin, width: parentWidth }} className={className}>
            <figure className='main-page-image' style={{ backgroundImage: `url(${imageUrl})`, height: height}}>
                <div style={{ textAlign: 'center', ...(isTop ? { top: '50px' } : { bottom: '50px' }), position: 'absolute', maxWidth: '400px' }}>
                    <p style={{ color: textColor }} className='main-page-image-text'><span class="fa-brands fa-apple" style={{ display: icon ? 'inline' : 'none', color: textColor, fontSize: '50px', verticalAlign: 'top' }}></span>{firstText}</p>
                    <span style={{ color: '#bf1516', letterSpacing: '2px', display: fourthText ? 'block' : 'none', fontSize: '16px', fontFamily: 'SF-Pro-Display-Light', marginBottom: '10px' }} className='main-page-image-text-2'>SERIES 9</span>
                    <p style={{ color: textColor }} className='main-page-image-text-2'><span className="rainbow-text">{thirdText}</span>{secondText}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <div style={{ fontSize: '19px', marginRight: '50px' }}>
                            <a href="">Learn More</a>
                            <i className="fa-solid fa-chevron-right" style={{ color: '#0071e3', marginLeft: '3px', fontSize: '14px' }}></i>
                        </div>
                        <div style={{ fontSize: '19px' }}>
                            <a href="">Buy</a>
                            <i className="fa-solid fa-chevron-right" style={{ color: '#0071e3', marginLeft: '3px', fontSize: '14px' }}></i>
                        </div>
                    </div>
                </div>
            </figure>
        </div>
    );
}

export default ImageContainer;
