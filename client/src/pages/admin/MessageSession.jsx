import AdminLayout from "../../components/layout/AdminLayout";
import Title from "../../components/admin/Title";
import { Button } from "antd";
import { adminPath } from "../../routes/routeConfig";

function MessageSession() {
  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Messages</h2>
      </Title>
      <div className="bg-gradient-to-t from-transparent to-blue-500 rounded-t-lg h-32 flex justify-center items-center mt-5 w-full">
        <Button
          size="large"
          className="font-semibold w-48 hover:scale-105 transition duration-300"
          onClick={() => window.open(`/admin/${adminPath.meeting}`, "_blank")}
        >
          Go Live
        </Button>
      </div>
    </AdminLayout>
  );
}

export default MessageSession;
