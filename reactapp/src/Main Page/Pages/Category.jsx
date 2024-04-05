import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Video from '../Components/Video';
import Button from '../Components/Button';

const Category = ({ categories }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://localhost:7061/api/Product/getCategoryProducts?id=${categories.id}`);
                if (response.status != 204) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar darkmode={true} />
            {categories.childCategories ? 
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '75px 0 0 0', cursor: 'pointer' }}>
                    {categories.childCategories.map((child) => {
                        return (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={child.iconURL} />
                                </div>
                                <p style={{ color: 'black', margin: '5px 0 0 0', fontSize: '14px' }}>{child.categoryName}</p>
                            </div>
                        );
                    })}
                </div> : null
            }
            <div style={{ width: '100%', height: '30px', background: '#f5f5f7', marginTop: '20px' }}></div>
            <div style={{ width: '85%', margin: 'auto', position: 'relative' }}>
                <p style={{ fontSize: '70px', color: 'black', fontFamily: 'SF-Pro-Display-Bold', display: categories.childCategories ? 'block' : 'none' }}>{categories.categoryName}</p>
                {categories.videoURL ? <Video url={categories.videoURL} /> : null}
                {categories.imageURL ? <img src={categories.imageURL} style={{ marginTop: '150px', width: '100%' }} /> : null}
            </div>
            <div style={{ width: '100%', background: '#f5f5f7', marginTop: '75px', paddingTop: '50px', minHeight: '500px' }}>
                <p style={{ fontSize: '50px', color: 'black', fontFamily: 'SF-Pro-Display-Regular', width: '85%', margin: 'auto' }}>Explore</p>
                {products.length === 0 ? null : null}
            </div>
            <div style={{ width: '100%', height: '30px', background: 'white' }}></div>
            <div style={{ width: '100%', height: '500px', background: '#f5f5f7' }}></div>
        </>
    );
};

export default Category;
