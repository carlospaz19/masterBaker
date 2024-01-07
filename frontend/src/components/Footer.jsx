import React from "react";
import facebookLogo from "/facebook_logo.png";
import xLogo from "/x_logo.png";
import instagramLogo from "/instagram_logo.png";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer id="footer">
        <div id="footer-links">
          <p>We hope you enjoy our delicious sweet breads!</p>
        </div>
        <div id="social-icons">
          <a href="#">
            <img src={facebookLogo} alt="Facebook" />
          </a>
          <a href="#">
            <img src={xLogo} alt="X" />
          </a>
          <a href="#">
            <img src={instagramLogo} alt="Instagram" />
          </a>
        </div>
        <div id="author">
          <p>Page developed by Carlos Paz Ortega</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
