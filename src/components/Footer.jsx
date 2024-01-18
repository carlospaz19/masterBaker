import linkedInLogo from "/linkedin_logo.jpeg";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer id="footer">
        <div id="footer-links">
          <p>We hope you enjoy our sweet delights!</p>
        </div>
        <div id="social-icons">
          <a href="https://www.linkedin.com/in/carlos-paz-ortega-75b006b5/">
            <img src={linkedInLogo} alt="X" />
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
