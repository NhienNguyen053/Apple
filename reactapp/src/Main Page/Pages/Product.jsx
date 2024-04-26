import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Slider from 'react-slick';
import Footer from '../Components/Footer';
import { ColorPreview } from '../../Admin Page/Components/color-utils';
import SelectButton from '../Components/SelectButton';
import Specification from '../Components/Specification';

const Product = ({ categories, products }) => {
    const [product, setProduct] = useState(products);
    const [images, setImages] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [activeButton2, setActiveButton2] = useState(null);
    const [activeColor, setActiveColor] = useState(null);

    const handleToggle = (buttonId) => {
        setActiveButton(buttonId);
    };

    useEffect(() => {
        if (product.colors.length > 0) {
            const colorToFilter = product.colors[0];
            const filteredImages = product.productImages.filter(image => image.color === colorToFilter);
            if (filteredImages.length > 0) {
                setImages(filteredImages[0].imageURLs);
            }
        } else {
            setImages(product.productImages[0].imageURLs);
        }
    }, [product]);

    const handleColorClick = (color) => {
        const matchingImage = product.productImages.find((img) => img.color === color);
        if (matchingImage) {
            setImages(matchingImage.imageURLs);
        }
        setActiveColor(color);
    };

    const sliderContainerStyle = {
        width: '70%',
        borderRadius: '25px',
        overflow: 'hidden',
        minHeight: '500px',
        maxHeight: '500px'
    };

    var settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        swipe: true,
        dots: true,
        swipe: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "#dfdee2", position: 'absolute', right: '25px', height: '50px', width: '50px', borderRadius: '50%' }}
                onClick={onClick}
            >
                <div style={{ fontSize: '24px', color: 'black', position: 'relative', top: '25%', justifyContent: 'center', display: 'flex' }}>
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, zIndex: '1000', display: "block", background: "#dfdee2", position: 'absolute', left: '25px', height: '50px', width: '50px', borderRadius: '50%' }}
                onClick={onClick}
            >
                <div style={{ fontSize: '24px', color: 'black', position: 'relative', top: '25%', justifyContent: 'center', display: 'flex' }}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
            </div>
        );
    }

    const renderSpecs = (name, value) => {
        return (<Specification spec={name} text={value} />);
    }

    return (
        <>
            <Navbar darkmode={false} />
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '86%', margin: '100px auto 0 auto' }}>
                <div style={{ width: '100%', margin: 'auto' }}>
                    <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '50px', margin: '0' }}>Buy {product.productName}</p>
                    <p style={{ color: 'black' }}>For ${product.productPrice}</p>
                </div>
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={sliderContainerStyle}>
                        {images.length > 0 ? (
                            <Slider {...settings} className="productSlider">
                                {images.map((image) => (
                                    <img key={image} src={image} alt={product.productName} style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '500px' }} />
                                ))}
                            </Slider>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f6f5f8' }}>
                                <p>No images available</p>
                            </div>
                        )}
                        <div>
                            {Object.entries(product.specifications).map(([specName, specValue]) => {
                                if (specValue && specValue.trim() !== '') {
                                    return renderSpecs(specName, specValue);
                                }
                                return null;
                            })}
                        </div>
                    </div>
                    <div style={{ width: '25%', margin: '0 auto 0 auto' }}>
                        {product.colors.length > 0 ? (
                            <div style={{ marginBottom: '181px' }}>
                                <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Semibold', fontSize: '24px' }}>Finish. <span style={{ color: '#86868b' }}>Pick your favorite.</span></p>
                                <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Semibold', fontSize: '16px' }}>Color</p>
                                <ColorPreview
                                    onClick={handleColorClick}
                                    colors={product.colors}
                                    sx={{ gap: '16px', justifyContent: 'flex-start', marginLeft: '10px' }}
                                    hover={false}
                                    width={25}
                                    height={25}
                                    isActive={activeColor}
                                />
                            </div>
                        ) : null}
                        {product.options.memory.length > 0 ? (
                            <div>
                                {product.options.memory.length > 0 && (
                                    <div>
                                        <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Semibold', fontSize: '24px' }}>
                                            Memory. <span style={{ color: '#86868b' }}>How much memory do you need.</span>
                                        </p>
                                        {product.options.memory.map((memory) => (
                                            <SelectButton
                                                buttonId={memory}
                                                buttonText={memory}
                                                isActive={activeButton === memory}
                                                onToggle={handleToggle}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : null}
                        {product.options.storage.length > 0 ? (
                            <div>
                                {product.options.storage.length > 0 && (
                                    <div>
                                        <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Semibold', fontSize: '24px' }}>
                                            Storage. <span style={{ color: '#86868b' }}>How much space do you need.</span>
                                        </p>
                                        {product.options.storage.map((storage) => (
                                            <SelectButton
                                                buttonId={storage}
                                                buttonText={storage}
                                                isActive={activeButton2 === storage}
                                                onToggle={handleToggle}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;
