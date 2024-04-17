import React from 'react';

const Specification = ({ spec, text }) => {
    const renderImage = () => {
        switch (spec) {
            case 'chip':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2Fchip.jpg?alt=media&token=270827bf-b909-44be-8dea-ea81267e0bc0" />
                        </div>
                    </>
                );
            case 'camera':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2Fcamera.jpg?alt=media&token=ec831bf8-316d-49b7-9c61-aa8a5239ade6" />
                        </div>
                    </>
                );
            case 'connector':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2Fconnector.jpg?alt=media&token=54289ace-7b7d-4070-96f2-23339bb586d3" />
                        </div>
                    </>
                );
            case 'functionality':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2Ffunctionality.jpg?alt=media&token=9c2e8aed-a261-48b7-8cda-f098a129fab7" />
                        </div>
                    </>
                );
            case 'material':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2Fmaterial.jpg?alt=media&token=939d987c-d6fc-4c26-b450-ba55dab8438e" />
                        </div>
                    </>
                );
            case 'powerAndBattery':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2FpowerAndBattery.jpg?alt=media&token=100436a7-6624-4d51-b8af-eb79e38c8152" />
                        </div>
                    </>
                );
            case 'sizeAndWeight':
                return (
                    <>
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FSpecifications%2FsizeAndWeight.jpg?alt=media&token=046a4673-3a89-40d8-b015-25b8a0875ff5" />
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <>
            <div style={{ width: '90%' }}>
                <div style={{ width: '50%' }}>
                    {renderImage()}
                    <p style={{ textAlign: 'center', color: 'black', fontSize: spec == 'display' ? '18px' : '14px', fontFamily: spec == 'display' ? 'SF-Pro-Display-Medium' : 'SF-Pro-Display-Light' }}>{text}</p>
                </div>
            </div>
        </>
    );
};

export default Specification;
