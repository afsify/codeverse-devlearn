import { Modal } from "antd";
import PropTypes from "prop-types";
import imageLinks from "../../assets/images/imageLinks";
import VerifiedIcon from "@mui/icons-material/Verified";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";

const AccountModal = ({ visible, toggleModal, user }) => {
  return (
    <Modal visible={visible} onCancel={toggleModal} footer={null} centered>
      <div className="text-center p-5">
        <div className="cursor-pointer hover:scale-110 duration-300">
          <div className="overflow-hidden rounded-full w-60 h-60 mx-auto shadow-md shadow-black mb-5">
            <img src={user?.image || imageLinks.profile} alt="Account" />
          </div>
        </div>
        <h2 className="text-2xl text-gray-700 font-semibold capitalize">
          {user?.name}
          {user?.developer ? (
            <TokenRoundedIcon
              className="ml-1 mb-1"
              sx={{ fontSize: 20, color: "green" }}
            />
          ) : user?.prime ? (
            <VerifiedIcon
              className="ml-1 mb-1"
              color="primary"
              sx={{ fontSize: 20 }}
            />
          ) : (
            ""
          )}
        </h2>{" "}
        <p className="text-sm text-gray-600">{user?.email}</p>{" "}
        <h3 className="text-md text-gray-500 capitalize">{user?.place}</h3>{" "}
      </div>
    </Modal>
  );
};

AccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  user: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    developer: PropTypes.string,
    prime: PropTypes.string,
    email: PropTypes.string,
    place: PropTypes.string,
  }),
};

export default AccountModal;
