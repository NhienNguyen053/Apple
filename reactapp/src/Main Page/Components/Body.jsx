import React from 'react';
import '../style.css';
import ImageContainer from './ImageContainer';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Body = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <div style={{ marginTop: '48px' }}>
            <ImageContainer height={'624px'} parentMargin={'0 0 15px 0'} textColor={'black'} isTop={true} firstText={"MacBookAir"} secondText={"Lean.Mean.M3 Machine"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F1.jpg?alt=media&token=56d92341-4a10-4750-8be8-99f8183a7056"} />
            <ImageContainer height={'624px'} parentMargin={'0 0 15px 0'} textColor={'white'} isTop={true} firstText={"AirPods Pro"} secondText={" Now playing"} thirdText={"Adaptive Audio."} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F2.jpg?alt=media&token=a0d618a4-bb91-4991-a999-6d23634c4144"} />
            <ImageContainer height={'624px'} parentMargin={'0 0 15px 0'} textColor={"white"} isTop={true} firstText={"iPhone 15 Pro"} secondText={"Titanium. So strong. So Light. So Pro"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.1.jpg?alt=media&token=c8aa74f0-5cb9-4b95-9fc6-8c548cc18aa4"} />
            <div style={{ display: 'flex' }}>
                <ImageContainer height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} firstText={"Vision Pro"} secondText={"Welcome to the era of spatial computing"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F3.jpg?alt=media&token=b1f7283a-ac92-4031-81fd-4df6e103fdd9"} />
                <ImageContainer height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} isTop={true} firstText={"iPhone 15"} secondText={"New camera. New design. Newphoria"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F4.2.jpg?alt=media&token=f6d520e3-25e3-4605-b189-19178a1bd8fb"} />
            </div>
            <div style={{ display: 'flex' }}>
                <ImageContainer height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'white'} isTop={true} icon={true} firstText={" WATCH"} secondText={"Smarter. Brighter. Mightier"} fourthText={true} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F5.1.jpg?alt=media&token=a0ec405a-ec6f-4f93-90bd-354c0454ac88"} />
                <ImageContainer height={'580px'} parentWidth={'48.5%'} parentMargin={'0 0 15px 15px'} textColor={'black'} isTop={true} firstText={"iPad"} secondText={"Lovable. Drawable. Magical"} imageUrl={"https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F5.2.jpg?alt=media&token=c73a22f3-5424-48af-a42a-ea37266b1091"} />
            </div>
            <div className="slider-container">
                <Slider {...settings}>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.1.jpg?alt=media&token=546be67a-a54d-4772-896d-15ddcd2eb159"/>
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.2.jpg?alt=media&token=be49b632-18b5-44ab-a2a2-eac0487ae04c"/>
                    </div>
                    <div>
                        <img src="https://firebasestorage.googleapis.com/v0/b/apple-12071.appspot.com/o/images%2FMainPageImages%2F7.3.jpg?alt=media&token=0f9c5d5a-068e-4690-9ec1-8b2132f0577c"/>
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default Body;
