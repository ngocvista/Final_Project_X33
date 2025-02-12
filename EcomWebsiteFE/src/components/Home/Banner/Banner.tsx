import React from "react";
import Slider from "./Slider";
import Img1 from "../../../assets/img/home-banner/other/img1.jpeg";
import Img2 from "../../../assets/img/home-banner/other/img2.jpeg";
import { Link } from "react-router-dom";
import { IBannerRightDataTypes } from "../../../types/types";

const Banner: React.FC = () => {
  const BannerRightData: IBannerRightDataTypes[] = [
    { id: 1, img: "https://i.pinimg.com/enabled/564x/e4/ac/1c/e4ac1c62cd247e2df4d9d554fca44021.jpg" },
    {
      id: 2,
      img: "https://i.pinimg.com/564x/13/94/b9/1394b92cd9222ad3827348a2f1728b1a.jpg",
    },
  ];

  return (
    <section id="home-banner">
      <div className="container">
        <div className="home-banner-content">
          <div className="banner-slider-wrapper banner-left">
            <Slider />
          </div>
          <div className="banner-right-imgs">
            {BannerRightData.map((item) => (
              <div key={item.id} className="banner-img-wrapper">
                <Link to="/shop">
                  <img
                    src={item.img}
                    alt="banner-img"
                    style={{
                      width: "390px",
                      height: "193px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
