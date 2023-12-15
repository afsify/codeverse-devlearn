import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { listBanner } from "../../api/services/userService";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { hideLoading, showLoading } from "../../utils/alertSlice";

function Banner() {
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);

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
  }, [dispatch]);

  return (
    <Carousel
      autoPlay
      infiniteLoop
      showArrows={false}
      showThumbs={false}
      showStatus={false}
      interval={3000}
      stopOnHover={false}
      emulateTouch={false}
      swipeable={true}
      transitionTime={500}
      className="overflow-hidden"
    >
      {banners.map((banner, index) => (
        <div key={index} className="relative h-full md:h-[84vh]">
          <div
            className="w-full h-full bg-cover bg-center relative flex flex-col justify-center items-center text-center text-white overflow-hidden"
            style={{
              backgroundImage: `url(${banner.image})`,
              borderRadius: "10px",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="p-4 relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg mb-4">{banner.description}</p>
              <a
                href={banner.link}
                className="text-blue-500 hover:underline text-base md:text-lg"
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
