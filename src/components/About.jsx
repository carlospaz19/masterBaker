import React from "react";
import aboutImageOne from "/aboutImageOne.jpeg";
import "./About.css";

function About() {
  return (
    <>
      <div className="about-section">
        <div className="about-section-left">
          <h2>About US</h2>
          <p>
            Master Baker is a renowned bakery located in Merida, Yucatan,
            dedicated to providing the highest quality baked goods to our
            customers. With a passion for artisanal techniques and premium
            ingredients, we strive to create delicious and visually stunning
            pastries, bread, and cakes.
          </p>
          <p>
            Our team of skilled bakers and pastry chefs work tirelessly to
            ensure that every product that leaves our bakery meets our strict
            standards of excellence. Whether you're looking for a daily trat or
            a special occasion cake, Master Baker is committed to delivering a
            delightful and memorable experience with every bite.
          </p>
        </div>
        <div className="about-section-right">
          <img src={aboutImageOne} />
        </div>
      </div>
      <div id="map-container">
        <div id="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.624239902925!2d-89.62584432444324!3d20.96759998066649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5671623c0fd4c3%3A0xda42c2632f3ddfe2!2sPlaza%20Principal%20de%20M%C3%A9rida%20%22Plaza%20Grande%22%2C%20%22%20Jo&#39;ile&#39;ex%20Nojoch%20k&#39;%C3%ADiwik%22!5e0!3m2!1ses-419!2smx!4v1704667221348!5m2!1ses-419!2smx"
            style={{ border: "0" }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default About;
