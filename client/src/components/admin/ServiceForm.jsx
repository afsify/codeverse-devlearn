import PropTypes from "prop-types";
import { Image } from "cloudinary-react";
import { useEffect, useState } from "react";
import { cloudUpload } from "../../api/cloudinary";
import { FileImageOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Upload } from "antd";

function ServiceForm({ visible, onCreate, onCancel, editData }) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    link: "",
  });

  const customUploadButton = (
    <div className=" flex-col">
      <div className="flex justify-center">
        {uploading ? (
          <div className="w-full h-full flex justify-center items-center mb-4">
            <div className="relative h-24 w-24">
              <div className="rounded-full h-24 w-24 border-t-4 border-t-blue-500 animate-spin absolute"></div>
              <div className="h-full w-full flex justify-center items-center">
                <h1 className="text-blue-500 text-3xl font-mono font-extrabold">
                  &lt;/&gt;
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <Image
            className="mb-2"
            cloudName={import.meta.env.VITE_CLOUD_NAME}
            publicId={imageUrl}
            width="150"
            crop="scale"
          />
        )}
      </div>
      <div className="flex justify-center">
        <Button className="flex items-center justify-center p-2">
          <FileImageOutlined />
          Upload Image
        </Button>
      </div>
    </div>
  );

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      const response = await cloudUpload(uploadFormData);
      setImageUrl(response.data.secure_url);
      setFormData({
        ...formData,
        image: response.data.secure_url,
      });
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedFormData = {
        ...formData,
        title: values.title,
        description: values.description,
        link: values.link,
      };
      form.resetFields();
      onCreate(updatedFormData);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      setImageUrl(editData.image || "");
      setFormData(editData);
    }
  }, [editData, form]);

  return (
    <Modal
      visible={visible}
      title={editData ? "Edit Service" : "Add Service"}
      okText={editData ? "Save" : "Create"}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Upload.Dragger
        customRequest={({ file }) => handleUpload(file)}
        accept="image/*"
        showUploadList={false}
      >
        {customUploadButton}
      </Upload.Dragger>
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link"
          rules={[{ required: true, message: "Please enter a link" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

ServiceForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default ServiceForm;
