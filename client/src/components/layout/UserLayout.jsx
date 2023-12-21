import PropTypes from "prop-types";
import Footer from "../user/Footer";
import Dropdown from "../user/Dropdown";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { userPath } from "../../routes/routeConfig";
import { getUser } from "../../api/services/userService";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const logged = localStorage.getItem("userToken") !== null;

  useEffect(() => {
    if (logged) {
      const fetchUserData = async () => {
        try {
          const userResponse = await getUser();
          const encodedUserData = btoa(
            JSON.stringify(userResponse.data.userData)
          );
          localStorage.setItem("userData", encodedUserData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [logged]);

  const userMenu = [
    {
      id: 1,
      name: "Home",
      path: userPath.home,
    },
    {
      id: 2,
      name: "Service",
      path: userPath.service,
    },
    {
      id: 3,
      name: "Course",
      path: userPath.course,
    },
    {
      id: 4,
      name: "Contact",
      path: userPath.contact,
    },
    {
      id: 5,
      name: "About",
      path: userPath.about,
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="py-4 px-4 box-border flex justify-center">
        <nav className="flex justify-center w-[99%] z-40 rounded-xl h-20 px-5 text-white bg-dark-purple shadow-black shadow-md fixed">
          <div className="flex w-full container justify-between items-center">
            <div className="h-full">
              <Link to={userPath.home}>
                <h1 className="text-5xl font-signature ml-2 mt-5">Codeverse</h1>
              </Link>
            </div>
            <div className="items-center hidden md:flex justify-center gap-3">
              <ul className="flex gap-1">
                {userMenu.map((menu) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <li
                      key={menu.id}
                      className="cursor-pointer font-medium hover:bg-light-white text-gray-300 rounded-md duration-200"
                    >
                      <div
                        className={`${
                          isActive && " bg-light-white rounded-md font-bold"
                        }`}
                        key={menu.path}
                        onClick={() => navigate(menu.path)}
                      >
                        {<span className="px-2">{menu.name}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Dropdown />
            </div>
            <div
              onClick={() => setNav(!nav)}
              className="cursor-pointer pr-4 z-50 text-gray-500 md:hidden"
            >
              {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
            </div>
            {nav && (
              <div className="flex top-0 bottom-0 left-0 w-full py-3 z-40 px-1 fixed">
                <div className="flex rounded-xl w-full shadow-black shadow-md bg-dark-purple">
                  <div className="flex absolute w-full justify-end mt-20 pe-8">
                    <Dropdown />
                  </div>
                  <ul className="flex flex-col w-full justify-center items-center">
                    {userMenu.map((menu) => {
                      const isActive = location.pathname === menu.path;
                      return (
                        <li
                          key={menu.id}
                          className="px-2 py-3 cursor-pointer text-3xl"
                        >
                          <Link
                            className={`${
                              isActive &&
                              "bg-light-white px-4 rounded-xl font-semibold"
                            }`}
                            onClick={() => setNav(!nav)}
                            to={menu.path}
                          >
                            {menu.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto mt-20 px-2 mb-5 min-h-[85vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

UserLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserLayout;
