import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Name from "../../components/user/Name";
import { useLocation } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import ChatList from "../../components/user/ChatList";
import Dropdown from "../../components/user/Dropdown";
import imageLinks from "../../assets/images/imageLinks";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatWindow from "../../components/user/ChatWindow";
import GroupModal from "../../components/user/GroupModal";
import DefaultWindow from "../../components/user/DefaultWindow";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import { Button, Tooltip, List, AutoComplete, Skeleton } from "antd";
import {
  findUser,
  editGroup,
  fetchChat,
  accessChat,
  createGroup,
} from "../../api/services/userService";

const Messages = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const selected = location.state?.selected;
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const encodedUserData = localStorage.getItem("userData");
  const userData = encodedUserData ? JSON.parse(atob(encodedUserData)) : null;

  const toggleAccountModal = () => {
    setAccountModalVisible(!isAccountModalVisible);
  };

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await findUser(searchTerm);
        setUsers(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (searchTerm) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const handleAccessChat = async (userId) => {
    const existingChatIds = new Set(chatData.map((chat) => chat._id));
    try {
      const values = {
        userId,
      };
      setLoading(true);
      const response = await accessChat(values);
      if (!existingChatIds.has(response.data._id)) {
        setChatData([...chatData, response.data]);
        setSelectedChat(response.data);
      } else {
        setSelectedChat(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setSkeleton(true);
        const response = await fetchChat();
        setChatData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setSkeleton(false);
      }
    };
    fetchChatData();
    setSelectedChat(selected);
  }, [selected]);

  const autoCompleteOptions = users.map((user) => ({
    value: user.name,
    label: (
      <List.Item>
        {loading ? (
          <Skeleton avatar active />
        ) : (
          <List.Item.Meta
            className="flex items-center gap-x-2"
            onClick={() => handleAccessChat(user._id)}
            avatar={
              <div className="overflow-hidden rounded-full w-11 h-11 mx-auto">
                <img src={user.image || imageLinks.profile} alt="Profile" />
              </div>
            }
            title={
              <div className="flex-col items-center">
                <h1 className="text-[13px] capitalize font-semibold">
                  {user.name}
                  {user.developer ? (
                    <TokenRoundedIcon
                      className="ml-1 mb-1"
                      sx={{ fontSize: 12, color: "green" }}
                    />
                  ) : user.prime ? (
                    <VerifiedIcon
                      className="ml-1 mb-1"
                      color="primary"
                      sx={{ fontSize: 12 }}
                    />
                  ) : (
                    ""
                  )}
                </h1>
                <h1 className="text-xs text-gray-500 font-sans">
                  {user.email}
                </h1>
              </div>
            }
          />
        )}
      </List.Item>
    ),
  }));

  const [editData, setEditData] = useState(null);

  const createGroupHandler = async (formData) => {
    try {
      const response = await createGroup(formData);
      setChatData([...chatData, response.data]);
      setSelectedChat(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const editGroupHandler = (chatId, chatName, users) => {
    const groupToEdit = {
      _id: chatId,
      chatName: chatName,
      users: users,
    };
    setEditData(groupToEdit);
    showModal();
  };

  const editExistingGroupHandler = async (formData) => {
    try {
      const response = await editGroup(editData._id, formData);
      setChatData([...chatData, response.data]);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const showModal = () => {
    setGroupModalVisible(true);
  };

  const handleCancel = () => {
    setGroupModalVisible(false);
    setEditData(null);
  };

  return (
    <div className="container mx-auto flex">
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`${
          selectedChat && "hidden md:flex"
        } flex w-full md:w-80 h-screen relative`}
      >
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full md:w-80 pt-6 px-1 relative duration-300 overflow-y-scroll"
        >
          <Name>
            <AutoComplete
              className="w-full h-10"
              placeholder="Search User"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              options={autoCompleteOptions}
              style={{ maxWidth: "100%" }}
              allowClear
            />
            <Dropdown />
          </Name>
          <ChatList
            chatData={chatData}
            userData={userData}
            skeleton={skeleton}
            selectedChat={selectedChat}
            notification={notification}
            setSelectedChat={setSelectedChat}
            setNotification={setNotification}
            editGroupHandler={editGroupHandler}
          />
        </motion.div>
        <Tooltip title="Create Group" placement="left">
          <Button
            onClick={showModal}
            size="large"
            shape="circle"
            className="absolute bottom-5 text-white right-5 z-40 hover:scale-105 shadow-md shadow-black"
            icon={<PlusOutlined />}
          ></Button>
        </Tooltip>
        <GroupModal
          visible={isGroupModalVisible}
          onCreate={editData ? editExistingGroupHandler : createGroupHandler}
          onCancel={handleCancel}
          editData={editData}
        />
      </motion.aside>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`${!selectedChat && "hidden md:block"} w-full`}
      >
        {selectedChat ? (
          <ChatWindow
            skeleton={skeleton}
            userData={userData}
            selectedChat={selectedChat}
            notification={notification}
            setSelectedChat={setSelectedChat}
            setNotification={setNotification}
            toggleAccountModal={toggleAccountModal}
            isAccountModalVisible={isAccountModalVisible}
          />
        ) : (
          <DefaultWindow skeleton={skeleton} />
        )}
      </motion.main>
    </div>
  );
};

export default Messages;
