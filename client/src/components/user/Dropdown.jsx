import PropTypes from "prop-types";
import Switcher from "../constant/Switcher";
import { Dropdown as AntDropdown } from "antd";
import { userPath } from "../../routes/routeConfig";
import { userActions } from "../../utils/userSlice";
import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import VerifiedIcon from "@mui/icons-material/Verified";
import imageLinks from "../../assets/images/imageLinks";
import { useLocation, useNavigate } from "react-router-dom";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import { selectIsDarkTheme, toggleTheme } from "../../utils/themeSlice";
import {
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  MessageOutlined,
} from "@ant-design/icons";

function Dropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const logged = localStorage.getItem("userToken") !== null;

  useEffect(() => {
    if (logged) {
      const encodedUserData = localStorage.getItem("userData");
      if (encodedUserData) {
        const parsedUserData = JSON.parse(atob(encodedUserData));
        setUserData(parsedUserData);
      }
    }
  }, [logged]);

  const handleChange = () => {
    dispatch(toggleTheme());
  };

  const items = [
    {
      label: (
        <div className="py-1">
          <h3 className="text-center text-lg uppercase font-semibold">
            <span>
              {userData?.name}
              {userData?.developer ? (
                <TokenRoundedIcon
                  className="ml-1 mb-1"
                  sx={{ fontSize: 16, color: "green" }}
                />
              ) : userData?.prime ? (
                <VerifiedIcon
                  className="ml-1 mb-1"
                  color="primary"
                  sx={{ fontSize: 16 }}
                />
              ) : (
                ""
              )}
            </span>
            <br />
            <span className="text-sm font-normal normal-case font-sans text-gray-500">
              {userData?.email}
            </span>
          </h3>
          <div className="flex justify-center mt-2">
            <Switcher isDarkTheme={isDarkTheme} handleChange={handleChange} />
          </div>
          <ul className="mt-2 space-y-2">
            <DropdownItem
              text="Home"
              icon={<HomeOutlined />}
              path={userPath?.home}
            />
            <DropdownItem
              text="My Profile"
              icon={<UserOutlined />}
              path={userPath?.profile}
            />
            <DropdownItem
              text="Messages"
              icon={<MessageOutlined />}
              path={userPath?.messages}
            />
            <li
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userData");
                setUserData(null);
                dispatch(userActions.userLogout());
                navigate(userPath?.home);
              }}
              className="flex items-center cursor-pointer px-2 py-1 hover:bg-light-red hover:text-red-500 rounded-md text-base space-x-2"
            >
              <LogoutOutlined />
              <span className="font-medium hover:text-red-500">Logout</span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      {logged && userData ? (
        <AntDropdown
          menu={{
            items,
          }}
          arrow={{
            pointAtCenter: true,
          }}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="custom-dropdown"
        >
          <div className="cursor-pointer hover:scale-110 duration-300">
            <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-md shadow-black ">
              <img src={userData?.image || imageLinks?.profile} alt="User" />
            </div>
          </div>
        </AntDropdown>
      ) : (
        <div
          className="cursor-pointer hover:scale-110 duration-300"
          onClick={() => navigate(userPath.login)}
        >
          <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-md shadow-black ">
            <img src={imageLinks?.profile} alt="Default User" />
          </div>
        </div>
      )}
    </Fragment>
  );
}

function DropdownItem({ text, icon, path }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  return (
    <li
      onClick={() => navigate(path)}
      className={`${
        isActive && "bg-light-purple text-blue-500 font-bold"
      } flex items-center cursor-pointer px-2 py-1 hover:bg-dark-white hover:text-blue-500 rounded-md text-base space-x-2`}
    >
      {icon}
      <span className="font-medium hover:text-blue-500">{text}</span>
    </li>
  );
}

DropdownItem.propTypes = {
  text: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  path: PropTypes.node.isRequired,
};

export default Dropdown;
