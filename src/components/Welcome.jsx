import welcomePastries from "/welcomePastries.jpg";
import welcomeImageOne from "/welcomeImageOne.jpeg";
import "./Welcome.css";

function Welcome() {
  return (
    <>
      <div className="welcome-container">
        <img src={welcomePastries} alt="welcomeText" />
        <div className="centered-text">
          <p>Please Indulge in Freshly Baked Delights!</p>
        </div>
      </div>
      <div className="welcome-message">
        <div className="justified-text">
          <p>
            Welcome to Master Baker, your go-to bakery in Merida, Yucatan!
            <br></br>
            We are dedicated to providing the finest baked goods and pastries to
            satisfy your cravings. Whether you're in need of a sweet treat or a
            savory delight, we've got you covered. Stay tuned for our latest
            creations and special offers!
          </p>
        </div>
      </div>
      <div className="welcome-images">
        <div>
          <p>Discover the Best Bakery</p>
        </div>
        <img src={welcomeImageOne} />
      </div>
    </>
  );
}

export default Welcome;
