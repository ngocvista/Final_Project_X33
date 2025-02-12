import React from "react";
import ChairsImg from "../../../assets/img/home-ads/chairs.jpeg";
import ChargerImg from "../../../assets/img/home-ads/charger.jpeg";
import SpeakerImg from "../../../assets/img/home-ads/speaker.jpeg";
import { Link } from "react-router-dom";
import { IAdsData1 } from "../../../types/types";

const HomeAds1: React.FC = () => {
  const AdsData1: IAdsData1[] = [
    { id: 1, img: "https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_laptop_gaming_wukong_d33e1e6762764ec799820bfcc5814047.jpg" },
    { id: 2, img: "https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_xa_kho.jpg" },
    { id: 3, img: "https://file.hstatic.net/200000722513/file/uu_dai_soc_banner_web_slider_800x400.png" },
  ];

  return (
    <section id="ads-1">
      <div className="container">
        <div className="row">
          {AdsData1.map((item) => (
            <div key={item.id} className="col-lg-4">
              <div className="ads-img">
                <Link to="/shop">
                  <img
                    src={item.img}
                    alt="ads-img"
                    style={{
                      width: "416px",
                      height: "224px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAds1;
