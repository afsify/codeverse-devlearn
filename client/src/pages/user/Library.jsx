import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Collapse, Input, Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { listOrder } from "../../api/services/userService";
import UserLayout from "../../components/layout/UserLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  SearchOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { Title } = Typography;

const VideoThumbnail = ({ index, video, image, onVideoClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="col-span-1 bg-white transform relative group overflow-hidden cursor-pointer rounded-lg hover:shadow-md transition duration-300"
    >
      <span onClick={() => onVideoClick(video)}>
        <div className="shadow-md rounded-lg overflow-hidden cursor-pointer">
          <img
            src={image}
            alt={`Video Thumbnail`}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-20 transition duration-300 group-hover:bg-opacity-75">
            <PlayCircleOutlined className="text-white text-6xl opacity-40 group-hover:opacity-100 transition duration-300" />
          </div>
          <h3 className="text-lg font-sans font-semibold pl-3">
            Video {index + 1}
          </h3>
        </div>
      </span>
    </motion.div>
  );
};

VideoThumbnail.propTypes = {
  index: PropTypes.number.isRequired,
  video: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onVideoClick: PropTypes.func.isRequired,
};

const VideoGrid = ({ videos, image, onVideoClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-2">
      {videos.map((video, index) => (
        <VideoThumbnail
          key={index}
          index={index}
          video={video}
          image={image}
          onVideoClick={onVideoClick}
        />
      ))}
    </div>
  );
};

VideoGrid.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string.isRequired,
  onVideoClick: PropTypes.func.isRequired,
};

const VideoGridWithAnimation = ({ videos, image, onVideoClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VideoGrid videos={videos} image={image} onVideoClick={onVideoClick} />
    </motion.div>
  );
};

VideoGridWithAnimation.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string.isRequired,
  onVideoClick: PropTypes.func.isRequired,
};

function Library() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [isPlaying, setPlaying] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoading());
        const response = await listOrder();
        dispatch(hideLoading());
        const orderData = response.data.data;
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      }
    };
    fetchOrders();
  }, [dispatch]);

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    filterOrders(input);
  };

  const filterOrders = (input) => {
    const filtered = orders.filter((order) =>
      order.title.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredOrders(orders);
  };

  const handleVideoClick = (videoUrl) => {
    if (selectedVideo === videoUrl) {
      setPlaying(!isPlaying);
    } else {
      setSelectedVideo(videoUrl);
      setPlaying(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <UserLayout>
      <div className="px-4 pb-3 flex items-center justify-between">
        <Title level={2}>Library</Title>
        <div className="flex items-center">
          <Input
            placeholder="Search services"
            value={searchInput}
            onChange={handleSearchInputChange}
            className="rounded-md py-2 w-44"
            prefix={
              <SearchOutlined
                style={{ color: "#1890ff", marginRight: "5px" }}
              />
            }
            suffix={
              searchInput && (
                <CloseCircleOutlined
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={clearSearchInput}
                />
              )
            }
          />
        </div>
      </div>
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="flex justify-center"
            key={selectedVideo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReactPlayer
              url={selectedVideo}
              controls
              width="65%"
              height="65%"
              playing={isPlaying}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {filteredOrders.map((order) => (
          <motion.div
            key={order._id}
            className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 mx-4 mb-4"
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 w-full md:w-1/4">
              <img
                src={order.image}
                alt={order.title}
                className="w-full h-40 object-cover mb-4 max-w-full"
              />
              <Title className="mb-2" level={3}>
                {order.title}
              </Title>
              <p className="text-gray-500">{order.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-lg font-semibold font-sans text-green-500">
                  ₹{order.price}
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-2">
              <div className="md:hidden">
                <Collapse accordion>
                  <Panel header="Show Videos" key="1">
                    <VideoGridWithAnimation
                      videos={order.videos}
                      image={order.image}
                      onVideoClick={handleVideoClick}
                    />
                  </Panel>
                </Collapse>
              </div>
              <div className="hidden md:block">
                <VideoGridWithAnimation
                  videos={order.videos}
                  image={order.image}
                  onVideoClick={handleVideoClick}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </UserLayout>
  );
}

export default Library;
