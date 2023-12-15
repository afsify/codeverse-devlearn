import PropTypes from "prop-types";
import { BiRupee } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function List({ title, description, image, id, price }) {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="cursor-pointer" onClick={handleButton}>
      <div className="rounded-lg shadow">
        <img
          className="rounded-lg object-cover"
          src={image}
          alt=""
          style={{ width: "100%", height: "200px" }}
        />
        <div className="p-3">
          <h5 className="text-xl font-bold text-gray-900">{title}</h5>
          <p className="text-gray-700">{description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <BiRupee className="mr-1" />
              <span className="text-lg font-bold">{price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};

export default List;
