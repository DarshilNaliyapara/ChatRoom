import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchCurrentUser } from "./fetchCurrentUser.js";

export default function Chat() {
  const { conversationUserName } = useParams();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const conversationName = location.state?.displayName;
  const members = location.state?.members || [];
  const chatContainerRef = useRef(null);

  const fetchMessages = async () => {
    if (!conversationUserName) {
      console.error("conversationUserName is undefined");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/${conversationUserName}/messages`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setMessages(data.data.messages);
      setParticipants(data.data.users);

      const user = await fetchCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/${conversationUserName}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            _id: result.data._id,
            message: newMessage,
            sentBy: {
              userName: currentUser.userName,
              displayName: currentUser.displayName,
              avatarUrl: currentUser.avatarUrl,
            },
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationUserName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <div className="p-4 bg-gray-800 shadow-md flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-100">
          Chat with{" "}
          <span className="text-blue-400">
            {conversationName} {members > 0 && `(${members} members)`}
          </span>
        </h1>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800"
      >
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sentBy?.userName === currentUser.userName;
            return (
              <div
                key={msg._id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <img
                    src={msg.sentBy.avatarUrl}
                    alt={msg.sentBy.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-2xl ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="text-xs mb-1 font-semibold">
                    {msg.sentBy?.displayName || "Unknown User"}
                  </div>
                  <div className="text-base">{msg.message}</div>
                  <div
                    className={`text-[10px] mt-1 ${
                      isMe ? "text-left" : "text-right"
                    } opacity-70`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {isMe && (
                  <img
                    src={msg.sentBy.avatarUrl}
                    alt={msg.sentBy.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No messages yet...
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-800 shadow-inner flex gap-2 items-center"
      >
        <input
          type="text"
          className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}
