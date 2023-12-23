import PropTypes from "prop-types";
import { Image as AntImage } from "antd";
import imageLinks from "../../assets/images/imageLinks";

const Skeleton = ({ type, count, width, height }) => {
  const getClassName = () => {
    switch (type) {
      case "text":
        return `h-4 bg-gray-300 animate-pulse`;
      case "circle":
        return `flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 animate-pulse`;
      case "image":
        return `flex items-center rounded-lg justify-center w-${width} h-${height} bg-gray-300 animate-pulse`;
      default:
        return `h-${height} bg-gray-300 animate-pulse`;
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: count }, (_, index) => (
      <div key={index} className={`mb-2 ${getClassName()}`}>
        {type === "image" && (
          <AntImage
            preview={false}
            src={imageLinks.horizontal}
            alt={`Image Skeleton ${index}`}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
    ));
  };

  return <div>{renderSkeletons()}</div>;
};

Skeleton.propTypes = {
  type: PropTypes.oneOf(["text", "circle", "image"]),
  count: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

Skeleton.defaultProps = {
  type: "text",
  width: 4,
  height: 4,
};

export default Skeleton;
