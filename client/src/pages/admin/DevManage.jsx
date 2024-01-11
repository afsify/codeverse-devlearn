import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Title from "../../components/admin/Title";
import { useEffect, useRef, useState } from "react";
import imageLinks from "../../assets/images/imageLinks";
import AdminLayout from "../../components/layout/AdminLayout";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import {
  acceptDev,
  rejectDev,
  removeDev,
  devRequest,
} from "../../api/services/adminService";
import {
  Tag,
  Modal,
  Input,
  Space,
  Empty,
  Button,
  Select,
  Pagination,
} from "antd";
import {
  StopOutlined,
  SearchOutlined,
  GithubOutlined,
  LinkedinOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { confirm } = Modal;
const { Option } = Select;

function DevManage() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [devs, setDevs] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [sortBy, setSortBy] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDev, setSelectedDev] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        dispatch(showLoading());
        const response = await devRequest();
        dispatch(hideLoading());
        const devData = response.data.data;
        setDevs(devData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching developers:", error);
        setDevs([]);
      }
    };
    fetchDevs();
    inputRef.current && inputRef.current.focus();
  }, [dispatch]);

  const acceptDevHandler = async (devId) => {
    try {
      const response = await acceptDev(devId);
      if (response.data.success) {
        const updatedDevs = devs.map((dev) =>
          dev._id === devId ? { ...dev, status: "accepted" } : dev
        );
        setDevs(updatedDevs);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error accepting developer:", error);
    }
  };

  const rejectDevHandler = async (devId) => {
    try {
      const response = await rejectDev(devId);
      if (response.data.success) {
        const updatedDevs = devs.map((dev) =>
          dev._id === devId ? { ...dev, status: "rejected" } : dev
        );
        setDevs(updatedDevs);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error rejecting developer:", error);
    }
  };

  const removeDevHandler = async (devId) => {
    try {
      const response = await removeDev(devId);
      if (response.data.success) {
        const updatedDevs = devs.map((dev) =>
          dev._id === devId ? { ...dev, status: "remove" } : dev
        );
        setDevs(updatedDevs);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing developer:", error);
    }
  };

  const handleSortByName = (value) => {
    if (value === "asc") {
      const sortedDevs = [...devs].sort((a, b) =>
        a.user.name.localeCompare(b.user.name)
      );
      setDevs(sortedDevs);
      setSortBy("asc");
    } else if (value === "desc") {
      const sortedDevs = [...devs].sort((a, b) =>
        b.user.name.localeCompare(a.user.name)
      );
      setDevs(sortedDevs);
      setSortBy("desc");
    } else {
      setSortBy("");
    }
  };

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const filteredDevs = devs.filter((dev) => {
    if (filterStatus === "all") {
      return true;
    } else {
      return dev.status === filterStatus;
    }
  });

  const searchedDevs = filteredDevs.filter((dev) =>
    dev.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const devsToDisplay = searchedDevs.slice(start, end);

  const showAcceptConfirm = (devId) => {
    confirm({
      title: "Are you sure you want to accept this request?",
      icon: <ExclamationCircleFilled />,
      content: "Accepting the developer will allow further interactions.",
      okText: "Accept",
      okType: "success",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        acceptDevHandler(devId);
      },
    });
  };

  const showRejectConfirm = (devId) => {
    confirm({
      title: "Are you sure you want to reject this request?",
      icon: <ExclamationCircleFilled />,
      content: "Rejecting the developer will prevent further interactions.",
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        rejectDevHandler(devId);
      },
    });
  };

  const showRemoveConfirm = (devId) => {
    confirm({
      title: "Are you sure you want to remove this developer?",
      icon: <ExclamationCircleFilled />,
      content: "Removing the developer will change the status to normal user.",
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        removeDevHandler(devId);
      },
    });
  };

  const handleImageClick = (dev) => {
    setSelectedDev(dev);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setSelectedDev(null);
    setIsModalVisible(false);
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Developers</h2>
        <Space>
          <Input
            ref={inputRef}
            className="w-52"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={
              <SearchOutlined
                style={{ color: "#1890ff", marginRight: "5px" }}
              />
            }
          />
        </Space>
      </Title>
      <div className="overflow-x-auto rounded-xl mt-5">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-dark-purple text-white">
            <tr>
              <th className="text-center border border-gray-300 py-2">#</th>
              <th className="text-center border border-gray-300 py-2">Name</th>
              <th className="text-center border border-gray-300 py-2">Email</th>
              <th className="text-center border border-gray-300 py-2">Type</th>
              <th className="text-center border border-gray-300 py-2">
                Domain
              </th>
              <th className="text-center border border-gray-300 py-2">
                Experience
              </th>
              <th className="text-center border border-gray-300 py-2">
                Status
              </th>
              <th className="text-center border border-gray-300 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {devsToDisplay.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-14">
                  <div className="flex justify-center items-center h-full">
                    <Empty
                      description={
                        <span className="text-lg text-gray-500">
                          No developers available.
                        </span>
                      }
                    />
                  </div>
                </td>
              </tr>
            ) : (
              devsToDisplay.map((dev, index) => (
                <tr key={dev._id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className=" text-center border border-gray-300 py-2 px-2">
                    <div
                      className="cursor-pointer hover:scale-105 duration-300"
                      onClick={() => handleImageClick(dev)}
                    >
                      {dev.user.image ? (
                        <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-sm shadow-black ">
                          <img src={dev.user.image} alt="User" />
                        </div>
                      ) : (
                        <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-sm shadow-black ">
                          <img src={imageLinks.profile} alt="Default User" />
                        </div>
                      )}
                    </div>
                    {dev.user.name}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {dev.user.email}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {dev.type}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {dev.domain}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {dev.experience}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    <span
                      className={`inline-block px-2 py-1 text-sm capitalize rounded-full ${
                        dev.status === "requested"
                          ? "bg-blue-500 text-white"
                          : dev.status === "accepted"
                          ? "bg-green-500 text-white"
                          : dev.status === "rejected"
                          ? "bg-red-500 text-white"
                          : dev.status === "removed"
                          ? "bg-gray-500 text-white"
                          : ""
                      }`}
                    >
                      {dev.status}
                    </span>
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-1">
                    {dev.status === "requested" ? (
                      <div className="flex justify-center gap-2 items-center">
                        <Button
                          className="rounded-full hover:scale-110 duration-300 flex justify-center items-center"
                          style={{
                            backgroundColor: "#67ba6c",
                            borderColor: "#67ba6c",
                            color: "#ffffff",
                          }}
                          onClick={() => showAcceptConfirm(dev._id)}
                          icon={<CheckCircleOutlined />}
                        >
                          Accept
                        </Button>
                        <Button
                          className="rounded-full hover:scale-110 duration-300 flex justify-center items-center"
                          style={{
                            backgroundColor: "#c5382a",
                            borderColor: "#c5382a",
                            color: "#ffffff",
                          }}
                          onClick={() => showRejectConfirm(dev._id)}
                          icon={<CloseCircleOutlined />}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : dev.status === "accepted" ? (
                      <div className="flex justify-center items-center">
                        <Button
                          className="rounded-full hover:scale-110 duration-300 flex justify-center items-center"
                          style={{
                            backgroundColor: "#949494",
                            borderColor: "#949494",
                            color: "#ffffff",
                          }}
                          onClick={() => showRemoveConfirm(dev._id)}
                          icon={<StopOutlined />}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Modal
          title=""
          visible={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
          width={300}
          bodyStyle={{ padding: "5px" }}
        >
          {selectedDev && (
            <>
              <div className="flex items-center justify-between pb-3 border-b-2">
                <div className="overflow-hidden rounded-full w-20 h-20 shadow-md">
                  <img
                    src={selectedDev.user?.image || imageLinks.profile}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center px-3 items-center text-xl font-semibold text-gray-700 text-center mb-2">
                  <span>
                    {selectedDev.user?.name}
                    {selectedDev.user?.developer && (
                      <TokenRoundedIcon
                        className="ml-1 mb-1"
                        sx={{ fontSize: 16, color: "green" }}
                      />
                    )}
                  </span>
                  <span className="text-sm font-normal normal-case font-sans text-gray-500">
                    {selectedDev?.type}
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-center font-sans text-gray-600">
                  {selectedDev.domain}
                </p>
                <p className="text-center font-sans text-gray-600">
                  {selectedDev.experience}
                </p>
              </div>
              <div className="flex flex-wrap overflow-y-auto max-h-[59px] scrollable-container justify-center mt-2">
                {selectedDev.skills.map((skill) => (
                  <Tag key={skill} className="mb-2 mx-1">
                    {skill}
                  </Tag>
                ))}
              </div>
              <div className="flex justify-between gap-x-3 mt-3">
                <a
                  href={
                    selectedDev.linkedin || "https://linkedin.com/in/example"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 duration-300 hover:text-[#0366c3]"
                >
                  <LinkedinOutlined style={{ fontSize: "30px" }} />
                </a>
                <a
                  href={selectedDev.github || "https://github.com/example"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 duration-300 hover:text-[#9e5eb8]"
                >
                  <GithubOutlined style={{ fontSize: "30px" }} />
                </a>
              </div>
            </>
          )}
        </Modal>
      </div>
      <div className="mt-4 mb-20 flex justify-between items-center px-2">
        <div>
          <Select
            defaultValue="all"
            style={{ width: 90 }}
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value="all">All</Option>
            <Option value="requested">Requested</Option>
            <Option value="accepted">Accepted</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="removed">Removed</Option>
          </Select>
        </div>
        <Pagination
          current={currentPage}
          total={devs.length}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
        <div>
          <Select
            defaultValue=""
            style={{ width: 90 }}
            onChange={handleSortByName}
          >
            <Option value="">Sort</Option>
            <Option value="asc">A-Z</Option>
            <Option value="desc">Z-A</Option>
          </Select>
          <Select
            defaultValue={pageSize}
            style={{ width: 90 }}
            onChange={(value) => {
              setCurrentPage(1);
              setPageSize(value);
            }}
          >
            <Option value={10}>10/{devs.length}</Option>
            <Option value={20}>20/{devs.length}</Option>
            <Option value={50}>50/{devs.length}</Option>
            <Option value={100}>100/{devs.length}</Option>
          </Select>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DevManage;
