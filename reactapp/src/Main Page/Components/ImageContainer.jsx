import React, { useEffect, useState } from 'react';
import '../style.css';

const ImageContainer = (parentMargin) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 0 15px 0' }}>
            <figure className='main-page-image'>
                <div style={{ textAlign: 'center', top: '50px', position: 'absolute' }}>
                    <p style={{color: 'black'}} className='main-page-image-text'>MacBookAir</p>
                    <p style={{ color: 'black' }} className='main-page-image-text-2'>Lean.Mean.M3 Machine</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <div style={{ fontSize: '19px', marginRight: '50px' }}>
                            <a href="">Learn More</a>
                            <i class="fa-solid fa-chevron-right" style={{ color: '#0071e3', marginLeft: '3px', verticalAlign: 'middle' }}></i>
                        </div>
                        <div style={{ fontSize: '19px' }}>
                            <a href="">Buy</a>
                            <i class="fa-solid fa-chevron-right" style={{ color: '#0071e3', marginLeft: '3px', verticalAlign: 'middle' }}></i>
                        </div>
                    </div>
                </div>
            </figure>
        </div>
    );
}

export default ImageContainer;
