import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { listBanner } from "../../api/services/userService";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";

function Banner() {
  const [banners, setBanners] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        dispatch(showLoading());
        const response = await listBanner();
        dispatch(hideLoading());
        const bannerData = response.data.data;
        setBanners(bannerData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  return (
    <Carousel
      autoPlay
      infiniteLoop
      showArrows={false}
      showThumbs={false}
      showStatus={false}
      interval={3000}
      stopOnHover={false}
      emulateTouch={true}
      swipeable={true}
      transitionTime={500}
    >
      {banners.map((banner, index) => (
        <div key={index}>
          <div
            style={{
              backgroundImage: `url(${banner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "84vh",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#fff",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                borderRadius: "10px",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1,
              }}
            ></div>

            <div className="p-4" style={{ zIndex: 2 }}>
              <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
              <p className="text-xl mb-6">{banner.description}</p>
              <a
                href={banner.link}
                className="text-blue-500 hover:underline text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}

export default Banner;
