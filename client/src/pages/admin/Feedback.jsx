import { Button, Table } from "antd";
import useFetch from "../../hooks/useFetch";
import Title from "../../components/admin/Title";
import { adminPath } from "../../routes/routeConfig";
import AdminLayout from "../../components/layout/AdminLayout";
import { listFeedback } from "../../api/services/adminService";
import { VideoCameraOutlined } from "@ant-design/icons";

function Feedback() {
  const { data: feedback } = useFetch(listFeedback);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <div>
          <div>
            {new Date(createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
          <div>{new Date(createdAt).toLocaleDateString()}</div>
        </div>
      ),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      sortDirections: ["descend", "ascend"],
    },
  ];

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Feedbacks</h2>
        <Button
          className="text-white flex items-center ms-3"
          onClick={() => window.open(`/admin/${adminPath.meeting}`, "_blank")}
        >
          <VideoCameraOutlined />
          Go Live
        </Button>
      </Title>
      <div className="overflow-x-auto mt-5">
        <Table
          dataSource={feedback}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 4 }}
          rowKey="_id"
          bordered
        />
      </div>
    </AdminLayout>
  );
}

export default Feedback;
