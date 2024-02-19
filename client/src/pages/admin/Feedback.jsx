import { Button, Table, Card } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { adminPath } from "../../routes/routeConfig";
import AdminLayout from "../../components/layout/AdminLayout";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import { listFeedback } from "../../api/services/adminService";
import { VideoCameraOutlined } from "@ant-design/icons";

function Feedback() {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        dispatch(showLoading());
        const response = await listFeedback();
        dispatch(hideLoading());
        const feedback = response.data.data;
        setMessages(feedback);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching users:", error);
        setMessages([]);
      }
    };
    fetchFeedback();
  }, [dispatch]);

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
      <Card className="shadow-sm shadow-black mb-4 mt-5">
        <Table
          className="overflow-y-scroll"
          dataSource={messages}
          columns={columns}
          pagination={false}
          rowKey="_id"
        />
      </Card>
    </AdminLayout>
  );
}

export default Feedback;
