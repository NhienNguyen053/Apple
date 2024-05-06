import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Video from '../Components/Video';
import Slider from 'react-slick';
import Footer from '../Components/Footer';
import { ColorPreview } from '../../Admin Page/Components/color-utils';
import Specification from '../Components/Specification';

const Category = ({ categories }) => {
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            if (categories && categories.id) {
                try {
                    setProducts([]);
                    const response = await fetch(`https://localhost:7061/api/Product/getCategoryProducts?id=${categories.id}`);
                    if (response.status !== 204) {
                        const data = await response.json();
                        setProducts(data);
                    }
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            }
        };
        fetchProducts();
    }, [categories]);

    const routeChange = (name) => {
        const formattedName = name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/${formattedName}`);
    };

    const routeChange2 = (category, name) => {
        var filteredCategory;
        var formattedCategory
        if (categories.childCategories != null) {
            filteredCategory = categories.childCategories.find(x => x.id === category);
            formattedCategory = filteredCategory.categoryName.replace(/\s+/g, '-').toLowerCase();
        }
        else {
            formattedCategory = categories.categoryName.replace(/\s+/g, '-').toLowerCase();
        }
        const formattedName = name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/${formattedCategory}/${formattedName}`)
    }

    const renderSpecs = (name, value) => {
        return (<Specification spec={name} text={value} />);
    }

    const renderProductSlider = () => {
        if (products.length === 0) return null;

        return (
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product.id}>
                        <div style={{ cursor: 'pointer' }} onClick={() => routeChange2(product.subCategoryId, product.productName)} >
                            {product.productImages.length > 0 ? (
                                <div style={{ width: '90%', height: '288px', display: 'flex' }}>
                                    <img src={product.productImages[0].imageURLs[0]} alt={product.productName} style={{ maxWidth: '90%', height: 'auto', objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <div style={{ width: '100%', height: '288px' }}></div>
                            )}
                            <div className="color" style={{ display: 'flex', justifyContent: 'center', width: '95%', height: '49.2px' }}>
                                <ColorPreview colors={product.colors} sx={{ gap: '8px' }} hover={true} />
                            </div>
                            <p style={{ width: '90%', color: 'black', fontFamily: 'SF-Pro-Display-SemiBold', textAlign: 'center', fontSize: '22px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{product.productName}</p>
                            {product.productDescription ? <div className="description" style={{ width: '90%' }} dangerouslySetInnerHTML={{ __html: product.productDescription }} /> : <div style={{ width: '90%', height: '19.2px' }}></div>}
                            {product.productPrice ? <p className="price">For ${product.productPrice}</p> : null}
                            <div style={{ fontSize: '19px', alignItems: 'center', width: '95%' }}>
                                <a href="">Buy</a>
                                <i class="fa-solid fa-chevron-right" style={{ color: '#0071e3', marginLeft: '3px', marginTop: '2px', fontSize: '14px' }}></i>
                            </div>
                        </div>
                        <div style={{ border: '0.1px solid #e4e4e8', width: '100%', margin: '20px 0' }}></div>
                        {Object.entries(product.specifications).map(([specName, specValue]) => {
                            if (specValue && specValue.trim() !== '') {
                                return renderSpecs(specName, specValue);
                            }
                            return null;
                        }).filter((specComponent, index) => index < 3)}
                    </div>
                ))}
            </Slider>
        );
    };

    const settings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        swipe: true,
        height: '1000px',
    };

    return (
        <>
            <Navbar darkmode={true} />
            {categories && categories.childCategories ? (
                <div style={{ width: '90%', display: 'flex', justifyContent: 'center', margin: '75px auto 0 auto', cursor: 'pointer' }}>
                    {categories.childCategories.map((child) => (
                        <div key={child.categoryName} onClick={() => routeChange(child.categoryName)} style={{ width: '76px', margin: '0 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '60%', height: '80%', margin: 'auto' }}>
                                <img src={child.iconURL} alt={child.categoryName} style={{ width: '100%' }} />
                            </div>
                            <p style={{ color: 'black', margin: '5px 0 0 0', fontSize: '13px', textAlign: 'center' }}>{child.categoryName}</p>
                        </div>
                    ))}
                </div>
            ) : null}
            <div style={{ width: '100%', height: '30px', background: '#f5f5f7', marginTop: '20px' }}></div>
            <div style={{ width: '85%', margin: 'auto', position: 'relative' }}>
                <p style={{ fontSize: '70px', color: 'black', fontFamily: 'SF-Pro-Display-Bold', display: categories && categories.childCategories ? 'block' : 'none' }}>{categories && categories.categoryName}</p>
                {categories && categories.videoURL ? <Video url={categories.videoURL} /> : null}
                {categories && categories.imageURL ? <img src={categories.imageURL} alt={categories.categoryName} style={{ marginTop: '150px', width: '100%' }} /> : null}
            </div>
            <div style={{ width: '100%', background: 'white', marginTop: '75px', paddingTop: '50px', minHeight: '500px' }}>
                <p style={{ fontSize: '50px', color: 'black', fontFamily: 'SF-Pro-Display-Regular', width: '85%', margin: '0 auto 50px auto' }}>Explore</p>
                <div style={{ width: '85%', margin: 'auto' }}>
                    {renderProductSlider()}
                </div>
            </div>
            <div style={{ width: '100%', height: '30px', background: 'white' }}></div>
            <Footer />
        </>
    );
};

export default Category;
