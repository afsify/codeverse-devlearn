import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const DeleteConfirm = (onConfirm, itemId) => {
  Modal.confirm({
    title: "Are you sure you want to delete this?",
    icon: <QuestionCircleOutlined style={{ color: "red" }} />,
    content: "This action cannot be undone.",
    okText: "Yes",
    cancelText: "No",
    centered: true,
    onOk() {
      onConfirm(itemId);
    },
    onCancel() {},
    cancelButtonProps: {
      style: {
        color: "white",
      },
    },
  });
};

export default DeleteConfirm;
