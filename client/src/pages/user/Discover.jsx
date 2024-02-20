import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { userPath } from "../../routes/routeConfig";
import imageLinks from "../../assets/images/imageLinks";
import { useLocation, useNavigate } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  Tag,
  Input,
  Select,
  Pagination,
  Empty,
  Button,
  Card,
  Typography,
} from "antd";
import {
  GithubOutlined,
  SearchOutlined,
  LinkedinOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  accessChat,
  discoverDev,
  fetchChat,
} from "../../api/services/userService";

const { Option } = Select;
const { Title } = Typography;

function Discover() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [devs, setDevs] = useState([]);
  const service = location?.state.service;
  const [chatData, setChatData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const logged = localStorage.getItem("userToken") !== null;

  useEffect(() => {
    const fetchDev = async () => {
      try {
        dispatch(showLoading());
        const response = await discoverDev();
        dispatch(hideLoading());
        const serviceData = response.data.data;
        setDevs(serviceData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching dev:", error);
        setDevs([]);
      }
    };
    fetchDev();
  }, [dispatch]);

  const filteredDevs = devs.filter((dev) => {
    const isMatch =
      dev.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "All" || dev.type === filterType);
    return isMatch;
  });

  const clearSearchInput = () => {
    setSearchTerm("");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDevs = filteredDevs.slice(startIndex, endIndex);

  const handleAccessChat = async (userId) => {
    const existingChatIds = new Set(chatData.map((chat) => chat._id));
    try {
      const values = {
        userId,
      };
      const response = await accessChat(values);
      const selected = response.data;
      if (!existingChatIds.has(response.data._id)) {
        setChatData([...chatData, response.data]);
        navigate(`${userPath.messages}`, { state: { selected } });
      } else {
        navigate(`${userPath.messages}`, { state: { selected } });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetchChat();
        setChatData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };
    if (logged) {
      fetchChatData();
    }
  }, [logged]);

  const handleConnectClick = (user) => {
    logged ? handleAccessChat(user) : navigate(userPath.login);
  };

  return (
    <UserLayout>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="shadow-md rounded-lg p-4"
        >
          <div className="relative w-full h-40 sm:h-80 md:h-[500px]">
            <img
              alt={service.title}
              src={service.image}
              className="w-full h-full object-cover rounded-lg mb-4"
            />
          </div>
          <div className="flex justify-center items-center flex-col">
            <Title className="mt-4" level={2}>
              {service.title}
            </Title>
            <p className="text-gray-500 text-center md:w-1/2 mb-4">
              {service.description}
            </p>
          </div>
          <div className="flex justify-between">
            <Title className="uppercase" level={3}>
            Developers
            </Title>
            <div className="flex items-center">
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md py-2 w-44"
                prefix={
                  <SearchOutlined
                    style={{ color: "#1890ff", marginRight: "5px" }}
                  />
                }
                suffix={
                  searchTerm && (
                    <CloseCircleOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                      onClick={clearSearchInput}
                    />
                  )
                }
              />
            </div>
          </div>
          {paginatedDevs.length === 0 ? (
            <div className="flex justify-center items-center h-56 w-full">
              <Empty
                description={
                  <span className="text-lg text-gray-500">
                    No Developers Found
                  </span>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedDevs.map((dev) => (
                <Card
                  key={dev?._id}
                  className="shadow-lg cursor-pointer hover:scale-105 duration-300 rounded-lg md:w-80 mx-auto mt-3"
                >
                  <div className="flex items-center justify-between pb-3 border-b-2">
                    <div className="overflow-hidden rounded-full w-20 h-20 shadow-md">
                      <img
                        src={dev.user?.image || imageLinks.profile}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center mx-auto items-center text-xl font-semibold text-center mb-2">
                      <span>
                        {dev.user?.name}
                        {dev.user?.developer && (
                          <TokenRoundedIcon
                            className="ml-1 mb-1"
                            sx={{ fontSize: 16, color: "green" }}
                          />
                        )}
                      </span>
                      <span className="text-sm font-normal normal-case font-sans text-gray-500">
                        {dev?.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-center font-sans text-gray-500">
                      {dev.domain}
                    </p>
                    <p className="text-center font-sans text-gray-500">
                      {dev.experience}
                    </p>
                  </div>
                  <div className="flex flex-wrap overflow-y-auto max-h-[59px] justify-center mt-2">
                    {dev.skills.map((skill) => (
                      <Tag key={skill} className="mb-2 mx-1">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex justify-between gap-x-3 mt-2">
                    <a
                      href={dev.linkedin || "https://linkedin.com/in/example"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 duration-300 hover:text-[#0366c3]"
                    >
                      <LinkedinOutlined style={{ fontSize: "30px" }} />
                    </a>
                    <Button
                      className="rounded-full hover:scale-110 duration-300 flex justify-center items-center"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "#67ba6c",
                        color: "#67ba6c",
                      }}
                      onClick={() => handleConnectClick(dev.user)}
                    >
                      Connect
                    </Button>
                    <a
                      href={dev.github || "https://github.com/example"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 duration-300 hover:text-[#9e5eb8]"
                    >
                      <GithubOutlined style={{ fontSize: "30px" }} />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="flex justify-between mt-8 mb-4">
            <Select
              placeholder="Filter by Type"
              className="w-36"
              onChange={(value) => setFilterType(value)}
            >
              <Option value="All">All</Option>
              <Option value="App Developer">App Developer</Option>
              <Option value="Web Developer">Web Developer</Option>
              <Option value="Game Developer">Game Developer</Option>
              <Option value="UI/UX Designer">UI/UX Designer</Option>
              <Option value="AI/ML Developer">AI/ML Developer</Option>
              <Option value="DevOps Engineer">DevOps Engineer</Option>
            </Select>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredDevs.length}
              showQuickJumper
              onChange={handlePageChange}
            />
            <Select
              placeholder="Page Size"
              className="w-24"
              onChange={handlePageSizeChange}
              defaultValue={pageSize}
            >
              <Option value="8">8</Option>
              <Option value="16">16</Option>
              <Option value="24">24</Option>
              <Option value="32">32</Option>
            </Select>
          </div>
        </motion.div>
      )}
    </UserLayout>
  );
}

export default Discover;
