import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-light">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <h5 className="text-light">Company Name</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-light">About Us</a></li>
              <li><a href="/" className="text-decoration-none text-light">Contact Us</a></li>
              <li><a href="/" className="text-decoration-none text-light">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="col-md-4 col-sm-12">
            <h5 className="text-light">Follow Us</h5>
            <ul className="list-unstyled">
              <li><a href="/" title="Facebook" className="text-decoration-none text-light"><FaFacebook /></a></li>
              <li><a href="/" title="Twitter" className="text-decoration-none text-light"><FaTwitter /></a></li>
              <li><a href="/" title="Instagram" className="text-decoration-none text-light"><FaInstagram /></a></li>
            </ul>
          </div>
          <div className="col-md-4 col-sm-12 text-md-right">
            <h5 className="text-light">Copyright &copy; 2023 <strong>VCART</strong></h5>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
