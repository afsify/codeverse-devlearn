import { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Statistic, Table } from "antd";
import {
  BarChartOutlined,
  FundOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/layout/AdminLayout";
import Title from "../../components/admin/Title";
import { listDashboard } from "../../api/services/adminService";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";

const { Content } = Layout;

function Dashboard() {
  const dispatch = useDispatch();
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        dispatch(showLoading());
        const response = await listDashboard();
        dispatch(hideLoading());
        const dashboardData = response.data.data;
        setDashboard(dashboardData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching dashboard:", error);
        setDashboard({});
      }
    };
    fetchDashboard();
  }, [dispatch]);

  const columns = [
    {
      title: "OrderID",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (text) => (
        <span className="font-sans font-bold text-[10px]">{text}</span>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      align: "center",
      render: (user) => (
        <>
          <div className="cursor-pointer hover:scale-105 duration-300">
            {user.image ? (
              <div className="overflow-hidden rounded-full w-10 h-10 mx-auto shadow-sm shadow-black ">
                <img src={user.image} alt="User" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-full w-10 h-10 mx-auto shadow-sm shadow-black ">
                <img
                  src="https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/g9vfctxt7chji6uwgcn0.jpg"
                  alt="Default User"
                />
              </div>
            )}
          </div>
          <span className="text-center">{user.name}</span>
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => <span>{`₹ ${price}`}</span>,
    },
  ];

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </Title>
      <Content className="mt-5 mb-20">
        <Row gutter={16}>
          <Col xs={24} sm={16} md={16} lg={16} xl={16}>
            <Card
              className="shadow-sm shadow-black mb-4"
              title="Course Purchases"
              extra={<ShoppingCartOutlined />}
            >
              <Table
                className="overflow-y-scroll scrollable-container"
                columns={columns}
                dataSource={dashboard.orders}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Card
              className="shadow-sm shadow-black mb-4"
              title="Profit"
              extra={<BarChartOutlined />}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Prime Profit"
                    value={dashboard.primeProfit}
                    prefix="₹"
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Course Profit"
                    value={dashboard.courseProfit}
                    prefix="₹"
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Total Profit"
                    value={dashboard.totalProfit}
                    prefix="₹"
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
              </Row>
            </Card>
            <Card
              className="shadow-sm shadow-black mb-4"
              title="Users"
              extra={<UserOutlined />}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Prime Users"
                    value={dashboard.primeMembersCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Normal Users"
                    value={dashboard.normalUsersCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Total Users"
                    value={dashboard.totalMembersCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
              </Row>
            </Card>
            <Card
              className="shadow-sm shadow-black mb-4"
              title="Data Counts"
              extra={<FundOutlined />}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Orders"
                    value={dashboard.orderCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Courses"
                    value={dashboard.courseCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
              </Row>
            </Card>
            <Card
              className="shadow-sm shadow-black mb-4"
              title="Data Counts"
              extra={<FundOutlined />}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    value={dashboard.orderCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    value={dashboard.courseCount}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </AdminLayout>
  );
}

export default Dashboard;
