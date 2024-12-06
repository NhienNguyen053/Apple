import React, { useState, useRef } from "react";
import '../style.css';

const Video = ({ url }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div style={{ height: '100%', width: '100%', margin: 'auto', position: 'relative' }}>
            <video
                ref={videoRef}
                id="video"
                controls={false}
                autoPlay={false}
                muted={false}
                loop={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '25px' }}
                onEnded={handleVideoEnded}
            >
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <button className="play-button" onClick={togglePlay}>
                {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
            </button>
        </div>
    );
};

export default Video;
