import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCurrentUser } from "./fetchCurrentUser";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const [conversationResponse, user] = await Promise.all([
        fetch("http://localhost:8000/api/v1/conversation", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }).then((res) => res.json()),
        fetchCurrentUser(),
      ]);

      setConversations(conversationResponse?.data || []);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [query === ""]);

  useEffect(() => {
    handleSearch();
  }, [query]);

  const getConversationInfo = (conversation, currentUser) => {
    const {
      conversationUserName,
      conversationName,
      profileImage,
      participants,
    } = conversation;

    if (conversationUserName === currentUser?.userName) {
      const otherUser = participants.find((u) => u._id !== currentUser?._id);
      return {
        displayName: otherUser?.displayName || "Unknown User",
        userName: otherUser?.userName || "unknown",
        avatarUrl: otherUser?.avatarUrl || "default-avatar.png",
      };
    }

    return {
      displayName: conversationName,
      userName: conversationUserName,
      avatarUrl: profileImage,
    };
  };

  const handleSearch = async () => {
    const response = await fetch(
      "http://localhost:8000/api/v1/conversation/search",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationName: query }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      setConversations(data.data);
    }
  };

  const handleDelete = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/conversation/${conversationId}/delete`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-5 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search for Conversation..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1 p-3 border border-gray-300/20 backdrop-blur text-white rounded-lg text-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {conversations.map((conversation) => {
          const { _id } = conversation;
          const { displayName, userName, avatarUrl } = getConversationInfo(
            conversation,
            currentUser
          );

          return (
            <Link
              key={_id}
              to={`/chat/${conversation.conversationUserName}`}
              state={{
                displayName:
                  conversation.conversationUserName === userName
                    ? conversation.conversationName
                    : displayName,
                members: conversation.isGroupChat
                  ? conversation.participants.length
                  : "",
              }}
              className="relative flex flex-col items-center p-4 bg-gray-800/30 backdrop-blur rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-100 text-center">
                {displayName}
              </h2>
              <p className="text-sm text-gray-400 text-center">@{userName}</p>

              {!conversation.isGroupChat && (
                <DeleteForeverIcon
                  color="error"
                  sx={{ fontSize: 45 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete(conversation._id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
