import toast from "react-hot-toast";
import { Fragment, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Title from "../../components/admin/Title";
import imageLinks from "../../assets/images/imageLinks";
import AdminLayout from "../../components/layout/AdminLayout";
import { Tag, Table, Modal, Input, Empty, Button } from "antd";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import {
  acceptDev,
  rejectDev,
  removeDev,
  devRequest,
} from "../../api/services/adminService";
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

function DevManage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedDev, setSelectedDev] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: developer, setData: setDeveloper } = useFetch(devRequest);

  const acceptDevHandler = async (devId) => {
    try {
      const response = await acceptDev(devId);
      if (response.data.success) {
        const updatedData = developer.map((dev) =>
          dev._id === devId ? { ...dev, status: "accepted" } : dev
        );
        setDeveloper(updatedData);
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
        const updatedData = developer.map((dev) =>
          dev._id === devId ? { ...dev, status: "rejected" } : dev
        );
        setDeveloper(updatedData);
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
        const updatedData = developer.map((dev) =>
          dev._id === devId ? { ...dev, status: "remove" } : dev
        );
        setDeveloper(updatedData);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing developer:", error);
    }
  };

  const filteredDev = developer.filter((dev) =>
    dev.user.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const types = [...new Set(developer.map((dev) => dev.type))];
  const domains = [...new Set(developer.map((dev) => dev.domain))];
  const experiences = [...new Set(developer.map((dev) => dev.experience))];
  const statuses = [...new Set(developer.map((dev) => dev.status))];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record) => (
        <Fragment>
          <div
            className="cursor-pointer hover:scale-105 duration-300"
            onClick={() => handleImageClick(record)}
          >
            <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-sm shadow-black ">
              <img
                src={record?.user?.image || imageLinks?.profile}
                alt="User"
              />
            </div>
          </div>
          {record?.user?.name}
        </Fragment>
      ),
      filterDropdown: () => (
        <Input
          size="large"
          placeholder="Search Name"
          value={searchInput}
          className="rounded-md w-44"
          onChange={(e) => setSearchInput(e.target.value)}
          prefix={
            <SearchOutlined style={{ color: "#1890ff", marginRight: "5px" }} />
          }
          suffix={
            searchInput && (
              <CloseCircleOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => setSearchInput("")}
              />
            )
          }
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchInput ? "#1890ff" : undefined }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (text, record) => record.user.email,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      filters: types.map((type) => ({ text: type, value: type })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
      align: "center",
      filters: domains.map((domain) => ({ text: domain, value: domain })),
      onFilter: (value, record) => record.domain === value,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      align: "center",
      filters: experiences.map((exp) => ({ text: exp, value: exp })),
      onFilter: (value, record) => record.experience === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: statuses.map((status) => ({
        text: capitalizeFirstLetter(status),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,

      render: (text, record) => (
        <span
          className={`inline-block px-2 py-1 text-sm capitalize rounded-full ${
            record.status === "requested"
              ? "bg-blue-500 text-white"
              : record.status === "accepted"
              ? "bg-green-500 text-white"
              : record.status === "rejected"
              ? "bg-red-500 text-white"
              : record.status === "removed"
              ? "bg-gray-500 text-white"
              : ""
          }`}
        >
          {record.status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Fragment>
          {record.status === "requested" ? (
            <div className="flex justify-center gap-2 items-center">
              <Button
                className="rounded-full hover:scale-110 duration-300 flex justify-center items-center"
                style={{
                  backgroundColor: "#67ba6c",
                  borderColor: "#67ba6c",
                  color: "#ffffff",
                }}
                onClick={() => showAcceptConfirm(record._id)}
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
                onClick={() => showRejectConfirm(record._id)}
                icon={<CloseCircleOutlined />}
              >
                Reject
              </Button>
            </div>
          ) : record.status === "accepted" ? (
            <div className="flex justify-center items-center">
              <Button
                className="rounded-full hover:scale-110 duration-300 flex justify-center items-center"
                style={{
                  backgroundColor: "#949494",
                  borderColor: "#949494",
                  color: "#ffffff",
                }}
                onClick={() => showRemoveConfirm(record._id)}
                icon={<StopOutlined />}
              >
                Remove
              </Button>
            </div>
          ) : (
            ""
          )}
        </Fragment>
      ),
    },
  ];

  const showAcceptConfirm = (devId) => {
    confirm({
      title: "Are you sure you want to accept this request?",
      icon: <ExclamationCircleFilled />,
      content: "Accepting the developer will allow further interactions.",
      okText: "Accept",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        acceptDevHandler(devId);
      },
      cancelButtonProps: {
        style: {
          color: "white",
        },
      },
    });
  };

  const showRejectConfirm = (devId) => {
    confirm({
      title: "Are you sure you want to reject this request?",
      icon: <ExclamationCircleFilled />,
      content: "Rejecting the developer will prevent further interactions.",
      okText: "Reject",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        rejectDevHandler(devId);
      },
      cancelButtonProps: {
        style: {
          color: "white",
        },
      },
    });
  };

  const showRemoveConfirm = (devId) => {
    confirm({
      title: "Are you sure you want to remove this developer?",
      icon: <ExclamationCircleFilled />,
      content: "Removing the developer will change the status to normal user.",
      okText: "Remove",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        removeDevHandler(devId);
      },
      cancelButtonProps: {
        style: {
          color: "white",
        },
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
      </Title>
      <div className="overflow-x-auto rounded-xl mt-5">
        <Table
          dataSource={filteredDev}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 10 }}
          bordered
          locale={{
            emptyText: (
              <Empty
                description={
                  <span className="text-lg text-gray-500">
                    No developers available.
                  </span>
                }
              />
            ),
          }}
        />
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
            <Fragment>
              <div className="flex items-center justify-between pb-3 border-b-2">
                <div className="overflow-hidden rounded-full w-20 h-20 shadow-md">
                  <img
                    src={selectedDev.user?.image || imageLinks.profile}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center px-3 items-center text-xl font-semibold text-center mb-2">
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
                <p className="text-center font-sans text-gray-500">
                  {selectedDev.domain}
                </p>
                <p className="text-center font-sans text-gray-500">
                  {selectedDev.experience}
                </p>
              </div>
              <div className="flex flex-wrap overflow-y-auto max-h-[59px] justify-center mt-2">
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
            </Fragment>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default DevManage;
