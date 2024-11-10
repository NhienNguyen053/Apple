import '../style.css';
import ImageContainer from './ImageContainer';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import ViewportWidth from './ViewportWidth';
import Footer from './Footer';

const Body = () => {
    const viewportWidth = ViewportWidth();
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "rgba(255, 255, 255, 0.5)", position: 'absolute', right: 0, height: '100%', width: '3%' }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", zIndex: 100, background: "rgba(255, 255, 255, 0.5)", position: 'absolute', left: 0, height: '100%', width: '3%' }}
                onClick={onClick}
            />
        );
    }

    var settings = {
        dots: true,
        className: "center",
        centerMode: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        swipe: false,
        pauseOnHover: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    return (
        <div style={{ marginTop: '48px' }}>
            <ImageContainer link={'http://localhost:3000/iPhone-16'} height={'624px'} parentMargin={'0 0 15px 0'} textColor={'white'} isTop={true} firstText={"iPhone 16 Pro"} secondText={"Hello, Apple Intelligence"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2Fhero_iphone16pro_avail__fnf0f9x70jiy_largetall.jpg?alt=media&token=b06c2fff-2ffa-4bf4-9f15-8e14b8d50c62"} />
            <ImageContainer link={'http://localhost:3000/iPhone-16'} height={'624px'} parentMargin={'0 0 15px 0'} textColor={'white'} isTop={true} firstText={"iPhone 16"} secondText={"Hello, Apple Intelligence."} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2Fhero_iphone16_avail__euwzls69btea_largetall.jpg?alt=media&token=4e249caa-312b-42f3-b629-bd251bbe3791"} />
            <ImageContainer link={'http://localhost:3000/iPhone-15'} height={'624px'} parentMargin={'0 0 15px 0'} textColor={"white"} isTop={true} firstText={"iPhone 15 Pro"} secondText={"Titanium. So strong. So Light. So Pro"} imageUrl={viewportWidth > 1000 ? "https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.1.jpg?alt=media&token=c8aa74f0-5cb9-4b95-9fc6-8c548cc18aa4" : "https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.jpg?alt=media&token=6fa130e6-77f9-4975-b4d3-94a589ef745a"} />
            <div style={{ display: 'flex' }} className="imageContainer">
                <ImageContainer link={'http://localhost:3000/macbook-pro'} className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'White'} firstText={"MacBook Pro"} secondText={"A world of smart."} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2Fpromo_macbookpro_announce__gdf98j6tj2ie_large.jpg?alt=media&token=636087c3-ef2a-4430-8eb1-8f6be1f7283f"} />
                <ImageContainer link={'http://localhost:3000/iphone-15'} className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} isTop={true} firstText={"iPhone 15"} secondText={"New camera. New design. Newphoria"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.2.jpg?alt=media&token=f6d520e3-25e3-4605-b189-19178a1bd8fb"} />
            </div>
            <div style={{ display: 'flex' }} className="imageContainer">
                <ImageContainer link={'http://localhost:3000/apple-watch-series-10'} className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'white'} isTop={true} icon={true} firstText={" WATCH"} secondText={"Smarter. Brighter. Mightier"} fourthText={true} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F5.1.jpg?alt=media&token=a0ec405a-ec6f-4f93-90bd-354c0454ac88"} />
                <ImageContainer link={'http://localhost:3000/imac'} className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} isTop={true} firstText={"iMac"} secondText={"Brilliant"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2Fpromo_imac_announce__f4qdil7mfmeu_large.jpg?alt=media&token=3f6a5990-116c-4df7-af9a-6f0d4159f3eb"} />
            </div>
            <div className="slider-container" style={{ marginBottom: '50px' }}>
                <Slider {...settings}>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.1.jpg?alt=media&token=546be67a-a54d-4772-896d-15ddcd2eb159" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.2.jpg?alt=media&token=be49b632-18b5-44ab-a2a2-eac0487ae04c" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.3.jpg?alt=media&token=0f9c5d5a-068e-4690-9ec1-8b2132f0577c" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.4.jpg?alt=media&token=54d5e719-cb24-473b-9e5c-634d4c03a3ab" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.5.jpg?alt=media&token=c80c2692-3c64-4ff5-b93e-cc293049d69d" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.6.jpg?alt=media&token=e9698e9d-8d97-40c0-8ab2-a88595f8be52" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.7.jpg?alt=media&token=1bf1f475-3d3f-4ab9-a83b-333d9804d415" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.8.jpg?alt=media&token=74929d50-d5d1-466c-8a7d-1485e588a29d" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.9.jpg?alt=media&token=5ca80b10-17f9-4266-b827-df82bba5aea1" style={{ width: '99%' }} />
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.10.jpg?alt=media&token=85aa513d-fe40-4608-b782-dc71e377bf4d" style={{ width: '99%' }} />
                    </div>
                </Slider>
            </div>
            <Footer />
        </div>
    );
}

export default Body;
