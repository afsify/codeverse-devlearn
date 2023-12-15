import PropTypes from "prop-types";
import { Image } from "cloudinary-react";
import { useEffect, useState } from "react";
import { cloudUpload } from "../../api/cloudinary";
import { Button, Modal, Form, Input, Upload } from "antd";
import {
  DeleteOutlined,
  FileImageOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

function CourseForm({ visible, onCreate, onCancel, editData }) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoUrls, setVideoUrls] = useState(editData ? editData.videos : [""]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    preview: "",
    video: [],
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

  const addVideoUrlInput = () => {
    setVideoUrls([...videoUrls, ""]);
  };

  const removeVideoUrlInput = (index) => {
    const updatedVideoUrls = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(updatedVideoUrls);
  };

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
        price: values.price,
        preview: values.preview,
        videos: videoUrls,
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
      title={editData ? "Edit Course" : "Add Course"}
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
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter a price" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="preview"
          label="Preview"
          rules={[{ required: true, message: "Please enter preview url" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Video URLs">
          {videoUrls.map((videoUrl, index) => (
            <div key={index}>
              <Input
                type="text"
                placeholder="Enter Video URL"
                value={videoUrl}
                onChange={(e) => {
                  const updatedVideoUrls = [...videoUrls];
                  updatedVideoUrls[index] = e.target.value;
                  setVideoUrls(updatedVideoUrls);
                }}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => removeVideoUrlInput(index)}
              />
            </div>
          ))}
        </Form.Item>
        <Form.Item>
          <Button icon={<PlusCircleOutlined />} onClick={addVideoUrlInput}>
            Add Video URL
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

CourseForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default CourseForm;
