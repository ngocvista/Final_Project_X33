import React from "react";
import { Link } from "react-router-dom";
import { SocialMediaData } from "../../Other/SocialMediaData";

const ContactUs: React.FC = () => {
  return (
    <div className="contact-us">
      {/* ======= Title ======= */}
      <div className="contact-us-title">
        <h6>Liên hệ với chúng tôi</h6>
      </div>
      <div className="contact-us-content">
        {/* ======= Content - text ======= */}
        <div className="text">
          <p>Gọi cho chúng tôi 24/7</p>
          <h3> (+84) 835-778-789</h3>
          <p>
            101 P. Trần Đại Nghĩa, Bách Khoa, Hai Bà Trưng, Hà Nội, Việt Nam
            <br />
            <Link to="#/">bebu9x98@gmail.com</Link>
          </p>
        </div>
        {/* ======= Content - social media ======= */}
        <div className="social-media">
          <ul>
            {SocialMediaData.map((item) => (
              <li key={item.id}>
                <Link to={item.href} className={item.class}>
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
