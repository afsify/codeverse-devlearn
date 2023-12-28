import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { listBanner } from "../../api/services/userService";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Image as AntImage } from "antd";
import imageLinks from "../../assets/images/imageLinks";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await listBanner();
        const bannerData = response.data.data;
        setIsLoading(false);
        setBanners(bannerData);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
        fetchBanners();
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex items-center rounded-lg justify-center w-full md:h-[84vh] h-60 bg-gray-300 animate-pulse">
          <AntImage
            preview={false}
            src={imageLinks.horizontal}
            alt="Image Skeleton"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
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
                  <p className="text-sm md:text-lg mb-4">
                    {banner.description}
                  </p>
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
      )}
    </div>
  );
}

export default Banner;
