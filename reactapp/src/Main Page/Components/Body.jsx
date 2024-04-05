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
            <ImageContainer height={'624px'} parentMargin={'0 0 15px 0'} textColor={'black'} isTop={true} firstText={"MacBookAir"} secondText={"Lean.Mean.M3 Machine"} imageUrl={viewportWidth > 1000 ? "https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F1.jpg?alt=media&token=56d92341-4a10-4750-8be8-99f8183a7056" : "https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F1.1.jpg?alt=media&token=50759504-cbdf-4796-ae91-a50dfd546895"} />
            <ImageContainer height={'624px'} parentMargin={'0 0 15px 0'} textColor={'white'} isTop={true} firstText={"AirPods Pro"} secondText={" Now playing"} thirdText={"Adaptive Audio."} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F2.jpg?alt=media&token=a0d618a4-bb91-4991-a999-6d23634c4144"} />
            <ImageContainer height={'624px'} parentMargin={'0 0 15px 0'} textColor={"white"} isTop={true} firstText={"iPhone 15 Pro"} secondText={"Titanium. So strong. So Light. So Pro"} imageUrl={viewportWidth > 1000 ? "https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.1.jpg?alt=media&token=c8aa74f0-5cb9-4b95-9fc6-8c548cc18aa4" : "https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.jpg?alt=media&token=6fa130e6-77f9-4975-b4d3-94a589ef745a"} />
            <div style={{ display: 'flex' }} className="imageContainer">
                <ImageContainer className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} firstText={"Vision Pro"} secondText={"Welcome to the era of spatial computing"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F3.jpg?alt=media&token=b1f7283a-ac92-4031-81fd-4df6e103fdd9"} />
                <ImageContainer className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} isTop={true} firstText={"iPhone 15"} secondText={"New camera. New design. Newphoria"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.2.jpg?alt=media&token=f6d520e3-25e3-4605-b189-19178a1bd8fb"} />
            </div>
            <div style={{ display: 'flex' }} className="imageContainer">
                <ImageContainer className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'white'} isTop={true} icon={true} firstText={" WATCH"} secondText={"Smarter. Brighter. Mightier"} fourthText={true} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F5.1.jpg?alt=media&token=a0ec405a-ec6f-4f93-90bd-354c0454ac88"} />
                <ImageContainer className={"media"} height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} isTop={true} firstText={"iPad"} secondText={"Lovable. Drawable. Magical"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F5.2.jpg?alt=media&token=c73a22f3-5424-48af-a42a-ea37266b1091"} />
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
