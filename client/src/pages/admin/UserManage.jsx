import toast from "react-hot-toast";
import { Fragment, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Title from "../../components/admin/Title";
import imageLinks from "../../assets/images/imageLinks";
import AdminLayout from "../../components/layout/AdminLayout";
import { Modal, Input, Empty, Table, Button, Tooltip } from "antd";
import {
  CodeFilled,
  EyeOutlined,
  CrownFilled,
  HeartFilled,
  SearchOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  listUser,
  blockUser,
  unblockUser,
} from "../../api/services/adminService";

const { confirm } = Modal;

function UserManage() {
  const [searchInput, setSearchInput] = useState("");

  const { data: user, setData: setUser } = useFetch(listUser);

  const blockUserHandler = async (userId) => {
    try {
      const response = await blockUser(userId);
      if (response.data.success) {
        const updatedUsers = user.map((user) =>
          user._id === userId ? { ...user, status: "blocked" } : user
        );
        setUser(updatedUsers);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unblockUserHandler = async (userId) => {
    try {
      const response = await unblockUser(userId);
      if (response.data.success) {
        const updatedUsers = user.map((user) =>
          user._id === userId ? { ...user, status: "active" } : user
        );
        setUser(updatedUsers);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = user.filter((user) =>
    user.name.toLowerCase().includes(searchInput.toLowerCase())
  );

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
          <div className="cursor-pointer hover:scale-105 duration-300">
            <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-sm shadow-black ">
              <img src={record?.image || imageLinks?.profile} alt="User" />
            </div>
          </div>
          {record.name}
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
    },
    {
      title: "Type",
      dataIndex: "prime",
      key: "prime",
      align: "center",
      render: (text, record) => (
        <Fragment>
          {record.prime ? (
            <Tooltip title="Prime Member" placement="left">
              <CrownFilled className="text-lg" style={{ color: "gold" }} />
            </Tooltip>
          ) : record.developer ? (
            <Tooltip title="Developer" placement="left">
              <CodeFilled className="text-lg" />
            </Tooltip>
          ) : (
            <Tooltip title="User" placement="left">
              <HeartFilled className="text-lg" style={{ color: "red" }} />
            </Tooltip>
          )}
        </Fragment>
      ),
      filters: [
        { text: "Prime Members", value: "prime" },
        { text: "Developers", value: "developer" },
        { text: "Normal Users", value: "user" },
      ],
      onFilter: (value, record) => {
        if (value === "prime") return record.prime;
        if (value === "developer") return record.developer;
        return !record.prime && !record.developer;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => (
        <Fragment>
          {record.status === "blocked" ? (
            <span className="text-red-500 text-sm">
              <ExclamationCircleFilled style={{ marginRight: "2px" }} /> Banned
            </span>
          ) : (
            <span className="text-green-500">
              <CheckCircleFilled style={{ marginRight: "5px" }} /> Active
            </span>
          )}
        </Fragment>
      ),
      filters: [
        { text: "Active", value: "unblocked" },
        { text: "Banned", value: "blocked" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Fragment>
          {record.status === "blocked" ? (
            <Tooltip title="Unblock" placement="left">
              <Button
                size="large"
                className="text-white"
                icon={<EyeOutlined />}
                onClick={() => showUnblockConfirm(record._id)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Block" placement="left">
              <Button
                size="large"
                className="text-white"
                icon={<EyeInvisibleOutlined />}
                onClick={() => showBlockConfirm(record._id)}
              />
            </Tooltip>
          )}
        </Fragment>
      ),
    },
  ];

  const showBlockConfirm = (userId) => {
    confirm({
      title: "Are you sure you want to block this user?",
      icon: <ExclamationCircleFilled />,
      content: "Blocking the user will prevent further interactions.",
      okText: "Block",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        blockUserHandler(userId);
      },
      cancelButtonProps: {
        style: {
          color: "white",
        },
      },
    });
  };

  const showUnblockConfirm = (userId) => {
    confirm({
      title: "Are you sure you want to unblock this user?",
      icon: <ExclamationCircleFilled />,
      content: "Unblocking the user will allow further interactions.",
      okText: "Unblock",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        unblockUserHandler(userId);
      },
      cancelButtonProps: {
        style: {
          color: "white",
        },
      },
    });
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Users</h2>
      </Title>
      <div className="overflow-x-auto mt-5">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 10 }}
          bordered
          locale={{
            emptyText: (
              <Empty
                description={
                  <span className="text-lg text-gray-500">
                    No users available.
                  </span>
                }
              />
            ),
          }}
        />
      </div>
    </AdminLayout>
  );
}

export default UserManage;
