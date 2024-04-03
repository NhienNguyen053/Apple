import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Video from '../Components/Video';

const Category = ({ categories }) => {
    const [category, setCategory] = useState(categories);
    return (
        <>
            <Navbar darkmode={true} />
            <div style={{ width: '85%', margin: 'auto' }}>
                <p style={{ fontSize: '70px', color: 'black', fontFamily: 'SF-Pro-Display-Bold' }}>{category.categoryName}</p>
                {category.videoURL ? < Video url={category.videoURL} /> : null}
            </div>
        </>
    );
};

export default Category;
