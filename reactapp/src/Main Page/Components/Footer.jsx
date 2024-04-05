import React from "react";
import '../style.css';

function Footer() {
  return (
      <>
        <div style={{width: '100%', backgroundColor: '#f5f5f7', height: '120px'}}>
            <div style={{width: '66%', margin: 'auto', padding: '5px 0 5px 0'}}>
                <div style={{borderBottom: '0.2px solid #c3c3c3', padding: '5px 0 5px 0'}}>
                  <p style={{fontSize: '13.7px'}}>The Apple Online Store uses industry-standard encryption to protect the confidentiality of the information you submit. Learn more about our <a href="" style={{color: '#80818f', textDecoration: 'underline'}}>Security Policy</a></p>
                </div>
                <div style={{display: 'flex', paddingTop: '5px'}}>
                  <p style={{fontSize: '13.7px'}}>Copyright <i className="fa-regular fa-copyright" style={{fontSize: '10px'}}></i> 2023 Apple Inc. All rights reserved.</p>
                  <div style={{display: 'flex', fontSize: '13.7px'}} className="container2">
                    <p>Privacy Policy</p>
                    <p>Terms of Use</p>
                    <p>Sales and Refunds</p>
                    <p>Legal</p>
                    <p>Site Map</p>
                  </div>
                </div>
            </div>
        </div>
      </>
  );
}

export default Footer;
