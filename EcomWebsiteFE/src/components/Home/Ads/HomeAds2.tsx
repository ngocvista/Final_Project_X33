import React from "react";
import BedImg from "../../../assets/img/home-ads/fabric-bed.jpeg";
import IphoneImg from "../../../assets/img/home-ads/iphonex.jpeg";
import { Link } from "react-router-dom";

const HomeAds2: React.FC = () => {
  return (
    <section id="ads-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* ======= Bed img ======= */}
            <div className="bed-img">
              <Link to="/shop">
                <img
                  src={
                    "https://lh3.googleusercontent.com/jDa81Epa01lur459WsRO7BE9N1DEyE3w1w-dPBvpdKe43nElVQCtTFBL8xlv9rU3Mgk43zXGChDmTHAlkd9t-mMwxcnQYnWd7Q=w1920-rw"
                  }
                  alt="bed"
                  style={{
                    width: "856px",
                    height: "193px",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </div>
          </div>
          <div className="col-lg-4">
            {/* ======= Iphone img ======= */}
            <div className="iphone-img">
              <Link to="/shop">
                <img
                  src={
                    "https://file.hstatic.net/200000722513/file/gearvn_800x400_asus_vivobook_gaming.jpg"
                  }
                  alt="iphonex"
                  style={{
                    width: "416px",
                    height: "193px",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAds2;
