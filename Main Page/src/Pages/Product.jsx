import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Slider from 'react-slick';
import Footer from '../Components/Footer';
import { ColorPreview } from '../Components/color-utils';
import SelectButton from '../Components/SelectButton';
import Specification from '../Components/Specification';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { fCurrency } from '../Components/utils/format-number';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

const Product = ({ categories, products }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(products);
    const [productPrice, setProductPrice] = useState(products.productPrice);
    const [activeMemoryPrice, setActiveMemoryPrice] = useState(0);
    const [activeStoragePrice, setActiveStoragePrice] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [activeButton2, setActiveButton2] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [cartChange, setCartChange] = useState(false);
    const [open, setOpen] = useState(false);
    const memoryPrices = {
        '4GB': 1242250,
        '8GB': 2484500,
        '16GB': 3726750,
        '32GB': 4969000,
        '64GB': 6211250
    };

    const storagePrices = {
        '64GB': 1242250,
        '128GB': 2484500,
        '256GB': 3726750,
        '512GB': 4969000,
        '1TB': 6211250,
        '2TB': 7453500
    };

    const handleToggle = (buttonId, buttonText) => {
        const selectedMemoryPrice = memoryPrices[buttonText] || 0;
        setProductPrice(prevPrice => prevPrice - activeMemoryPrice + selectedMemoryPrice);
        setActiveMemoryPrice(selectedMemoryPrice);
        setActiveButton(buttonId);
    };

    const handleToggle2 = (buttonId, buttonText) => {
        const selectedStoragePrice = storagePrices[buttonText] || 0;
        setProductPrice(prevPrice => prevPrice - activeStoragePrice + selectedStoragePrice);
        setActiveStoragePrice(selectedStoragePrice);
        setActiveButton2(buttonId);
    }

    const nonEmptySpecsCount = Object.values(product.specifications).filter(specValue => specValue && specValue.trim() !== '').length;

    useEffect(() => {
        setProduct(products);
    }, [products]);

    useEffect(() => {
        if (product.colors.length > 0) {
            const colorToFilter = product.colors[0];
            const filteredImages = product.productImages.filter(image => image.color === colorToFilter);
            if (filteredImages.length > 0) {
                setImages(filteredImages[0].imageURLs);
            }
        } else {
            setImages(product.productImages.length == 0 ? [] : product.productImages[0].imageURLs);
        }
    }, [product]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`https://localhost:7061/api/Product/getRelatedProducts?subcategoryId=${product.subCategoryId}&id=${product.id}`);
            if (response.status !== 204) {
                const data = await response.json();
                setRelatedProducts(data);
            }
        }
        fetchProducts();
    }, [product]);

    const handleColorClick = (color) => {
        const matchingImage = product.productImages.find((img) => img.color === color);
        if (matchingImage) {
            if (matchingImage.imageURLs) {
                setImages(matchingImage.imageURLs);
            } else {
                setImages([]);
            }
        } else {
            setImages([]);
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
        return (<Specification spec={name} text={value} width={"25%"} />);
    }

    const renderSpecs2 = (name, value) => {
        return (<Specification spec={name} text={value} />);
    }

    const sliderSettings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        swipe: true,
        height: '1000px',
    };

    const renderProductSlider = () => {
        if (products.length === 0) return null;

        return (
            <Slider {...sliderSettings}>
                {relatedProducts.map((product) => (
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
                            {fCurrency(productPrice) ? <p className="price">For {fCurrency(productPrice)}</p> : null}
                            <div style={{ fontSize: '19px', alignItems: 'center', width: '95%' }}>
                                <a href="">Buy</a>
                                <i className="fa-solid fa-chevron-right" style={{ color: '#0071e3', marginLeft: '3px', marginTop: '2px', fontSize: '14px' }}></i>
                            </div>
                        </div>
                        <div style={{ border: '0.1px solid #e4e4e8', width: '100%', margin: '20px 0' }}></div>
                        {Object.entries(product.specifications).map(([specName, specValue]) => {
                            if (specValue && specValue.trim() !== '') {
                                return renderSpecs2(specName, specValue);
                            }
                            return null;
                        }).filter((specComponent, index) => index < 3)}
                    </div>
                ))}
            </Slider>
        );
    };

    const smoothScroll = (targetPosition, duration) => {
        const startPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const distance = targetPosition - startPosition;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        const scroll = () => {
            const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
            const timeElapsed = currentTime - startTime;
            const nextPosition = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, nextPosition);
            if (timeElapsed < duration) {
                requestAnimationFrame(scroll);
            } else {
                window.scrollTo(0, targetPosition);
            }
        };
        scroll();
    };

    const routeChange2 = (category, name) => {
        var filteredCategory;
        var formattedCategory;
        if (categories.childCategories != null) {
            filteredCategory = categories.childCategories.find(x => x.id === category);
            formattedCategory = filteredCategory.categoryName.replace(/\s+/g, '-').toLowerCase();
        }
        else {
            formattedCategory = categories.categoryName.replace(/\s+/g, '-').toLowerCase();
        }
        const formattedName = name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/${formattedCategory}/${formattedName}`);
        smoothScroll(0, 250);
    };

    const addToCart = async () => {
        setLoading(true);
        const jwtToken = Cookies.get('jwtToken');
        const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
        if (decodedToken == null) {
            const cartItem = {
                productId: product.id,
                color: activeColor,
                memory: activeButton,
                storage: activeButton2,
                quantity: 1
            };
            const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = existingCart.findIndex(item =>
                item.id === cartItem.id &&
                item.color === cartItem.color &&
                item.memory === cartItem.memory &&
                item.storage === cartItem.storage
            );
            if (existingItemIndex !== -1) {
                existingCart[existingItemIndex].quantity += 1;
            } else {
                existingCart.push(cartItem);
            }
            localStorage.setItem('cart', JSON.stringify(existingCart));
        } else {
            await fetch('https://localhost:7061/api/ShoppingCart/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    color: activeColor,
                    memory: activeButton,
                    storage: activeButton2,
                    quantity: 1,
                    userId: decodedToken['Id']
                }),
            });
        }
        setCartChange(!cartChange);
        setLoading(false);
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 5000);
        smoothScroll(0, 250);
    };

    return (
        <>
            <Navbar darkmode={false} onCartChange={cartChange} />
            <Collapse in={open} sx={{ width: '240px', position: 'absolute', right: '25px', top: '25px', zIndex: '1000' }}>
                <Alert sx={{ mb: 2 }} severity={'success'}>
                    Added to cart successfully!
                </Alert>
            </Collapse>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '86%', margin: '100px auto 0 auto' }}>
                <div style={{ width: '100%', margin: 'auto' }}>
                    <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Medium', fontSize: '50px', margin: '0' }}>Buy {product.productName}</p>
                    <p style={{ color: 'black' }}>For {fCurrency(productPrice)}</p>
                </div>
                <div style={{ width: '100%', display: 'flex', marginBottom: nonEmptySpecsCount <= 4 ? '110px' :  '110px' }}>
                    <div style={sliderContainerStyle}>
                        {images.length > 0 ? (
                            <Slider {...settings} className="productSlider">
                                {images.map((image) => (
                                    <div key={image} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px', overflow: 'hidden', width: '100%' }}>
                                        <img
                                            src={image}
                                            alt={product.productName}
                                            style={{
                                                width: 'auto',
                                                height: '100%',
                                                objectFit: 'contain',
                                                maxHeight: '500px',
                                                maxWidth: '100%'
                                            }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f6f5f8' }}>
                                <p>No images available</p>
                            </div>
                        )}
                    </div>
                    <div style={{ position: 'absolute', display: 'flex', bottom: nonEmptySpecsCount <= 4 ? '-180px' : '-220px', justifyContent: 'center', width: '60%', flexWrap: 'wrap', height: '140px' }}>
                        {Object.entries(product.specifications).map(([specName, specValue]) => {
                            if (specValue && specValue.trim() !== '') {
                                return renderSpecs(specName, specValue);
                            }
                            return null;
                        })}
                    </div>
                    <div style={{ width: '25%', minHeight: '780px', margin: '0 auto 0 auto' }}>
                        {product.colors.length > 0 ? (
                            <div style={{ marginBottom: '40px' }}>
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
                                                onToggle={handleToggle2}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : null}
                        <div style={{ width: '95%', display: 'flex' }}>
                            {loading ? (
                                <div className="lds-spinner">
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                </div>
                            ) : (
                                <button className="btn3" onClick={addToCart} disabled={product.colors.length > 0 && activeColor == null || product.options.memory.length > 0 && activeButton == null || product.options.storage.length > 0 && activeButton2 == null}>Add to bag</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: '1px', width: '85%', background: '#86868b', margin: 'auto' }}></div>
            <div style={{ width: '100%', background: 'white', paddingTop: '50px', minHeight: '500px', marginBottom: '50px' }}>
                <p style={{ fontSize: '50px', color: 'black', fontFamily: 'SF-Pro-Display-Regular', width: '85%', margin: '0 auto 50px auto', textAlign: 'center' }}>You might also like</p>
                <div style={{ width: '85%', margin: 'auto' }}>
                    {renderProductSlider()}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;
