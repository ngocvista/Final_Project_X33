import React, { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import { useSelector } from "react-redux"; // Import useSelector từ Redux
import { RootState } from "../../../redux/reducers"; // Import RootState để lấy kiểu của Redux store

interface ChatBoxProps {
  onClose: () => void;
  messages: any[]; // Danh sách tin nhắn truyền từ Home
  chatRoomId: number; // Nhận chatRoomId từ Home
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose, messages, chatRoomId }) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [stompClient, setStompClient] = useState<any>(null);
  const [msgList, setMsgList] = useState<any[]>(messages); // Lưu tin nhắn tại đây
  const user = useSelector((state: RootState) => state.user.user); // Lấy user từ Redux store
  const messagesEndRef = useRef<HTMLDivElement>(null); // Tạo ref cho phần tử cuối danh sách tin nhắn

  useEffect(() => {
    // Kết nối WebSocket khi component mount
    connectWebSocket();
    // Cleanup WebSocket connection khi component unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Mỗi khi msgList thay đổi, cuộn đến cuối danh sách tin nhắn
    scrollToBottom();
  }, [msgList]);

  // Hàm cuộn xuống dưới cùng danh sách tin nhắn
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hàm kết nối WebSocket
  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.over(socket);

    stomp.connect(
      {},
      (frame) => {
        console.log("Connected: " + frame);

        stomp.subscribe(`/topic/chatroom`, (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          console.log("Received message from WebSocket: ", message);
          setMsgList((prevMsgList) => [...prevMsgList, message]); // Cập nhật danh sách tin nhắn
        });
      },
      (error) => {
        console.error("WebSocket connection error: ", error);
      }
    );

    setStompClient(stomp);
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" && stompClient) {
      if (!user || !user.userId) {
        console.error("User or userId is missing from Redux");
        return;
      }

      const newMsgData = {
        content: inputMessage,
        sender: { id: user.userId },
        timestamp: new Date().toISOString(),
      };

      const newMsgDataSocket = {
        content: inputMessage,
        sender: {
          id: user.userId,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
          userId: user.userId,
        },
        timestamp: new Date().toISOString(),
      };

      // Gửi tin nhắn qua WebSocket
      stompClient.send(
        `/app/chat.sendMessage`,
        {},
        JSON.stringify(newMsgDataSocket)
      );

      // Gửi tin nhắn qua API để lưu vào cơ sở dữ liệu
      try {
        await axios.post(
          `http://localhost:8080/api/messages/chatroom/${chatRoomId}?userId=${user.userId}`,
          newMsgData
        );
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message via API:", error);
      }

      // Clear input sau khi gửi
      setInputMessage("");
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
            alt="User Avatar"
            style={styles.avatar}
          />
          <span>Tư vấn khách hàng</span>
        </div>
        <Button style={{ color: "#ffffff" }} type="text" onClick={onClose}>
          X
        </Button>
      </div>
      <div style={styles.messageList}>
        {msgList.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent:
                msg.sender.userId === user.userId ? "flex-end" : "flex-start", // Căn trái hoặc phải
            }}
          >
            {msg.sender.userId !== user.userId && (
              <img
                src={msg.sender.avatar}
                alt="Avatar"
                style={styles.avatarInMessage}
              />
            )}
            <div
              style={{
                ...styles.message,
                backgroundColor:
                  msg.sender.userId === user.userId ? "#f8c2c4" : "#f1f1f1", // Màu nền khác nhau cho người gửi và nhận
              }}
            >
              <div style={styles.messageHeader}>
                <span style={styles.senderName}>{msg.sender.fullName} - </span>
                <span style={styles.messageTimestamp}>
                  {" "}
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <div style={styles.messageText}>{msg.content}</div>
            </div>
          </div>
        ))}
        {/* Thêm ref vào phần tử cuối cùng của danh sách tin nhắn */}
        <div ref={messagesEndRef}></div>
      </div>
      <div style={styles.inputContainer}>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Đặt câu hỏi"
          style={styles.input}
          onPressEnter={handleSendMessage} // Thêm sự kiện gửi tin nhắn khi nhấn Enter
        />
        <Button
          type="primary"
          style={{ color: "#ffffff", backgroundColor: "#d91f28" }}
          shape="circle"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed" as "fixed",
    bottom: "20px",
    right: "20px",
    width: "550px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column" as "column",
    zIndex: 1000,
  },
  header: {
    padding: "10px",
    backgroundColor: "#d91f28",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    borderRadius: "50%",
    marginRight: "10px",
    width: "40px",
    height: "40px",
  },
  avatarInMessage: {
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    marginRight: "10px",
  },
  messageList: {
    flex: 1,
    padding: "10px",
    overflowY: "auto" as "auto",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "10px",
    alignItems: "flex-start",
  },
  message: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    wordWrap: "break-word" as "break-word",
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
    fontWeight: "bold" as "bold",
    fontSize: "14px",
  },
  senderName: {
    color: "#333",
  },
  messageTimestamp: {
    fontSize: "12px",
    color: "#888",
  },
  messageText: {
    fontSize: "14px",
    color: "#333",
  },
  inputContainer: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: "10px",
    borderRadius: "20px",
    height: "40px",
  },
};

export default ChatBox;
