import React from "react";
import '../style.css';

const Video = ({ url }) => {
    return (
        <>
            <div style={{ height: '680px', width: '100%', margin: 'auto' }}>
                <video controls style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </>
    );
};

export default Video;
