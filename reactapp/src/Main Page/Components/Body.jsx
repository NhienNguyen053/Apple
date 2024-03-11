import React, { useEffect, useState } from 'react';
import '../style.css';
import ImageContainer from './ImageContainer';

const Body = () => {
    return (
        <div style={{ marginTop: '48px' }}>
            <ImageContainer />
            <ImageContainer />
        </div>
    );
}

export default Body;
