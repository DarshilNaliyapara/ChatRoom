import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState({});

  const navigate = useNavigate(); // <-- Add this

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSearch = async () => {
    const response = await fetch("http://localhost:8000/api/v1/user/search", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: query }),
    });
    const data = await response.json();
    setUsers(data);
    console.log("Searching for:", query);
  };
  useEffect(() => {
    handleSearch();
  }, [query]);

  const createchat = (userName, displayName) => async () => {
    const response = await fetch(
      "http://localhost:8000/api/v1/conversation/user/create",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 409 || data.statusCode === 200) {
      const conversationUserName =
        data?.data?.conversation?.conversationUserName;
      if (conversationUserName) {
        navigate(`/chat/${conversationUserName}`, {
          state: {
            displayName: displayName,
            members: "",
          },
        });
      } else {
        console.error("Conversation user name not found in response.");
      }
    } else {
      console.error("Error creating chat:", data.message);
    }
  };
  return (
    <div className="font-sans p-5 max-w-md mx-auto">
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full p-3 mb-2 border text-gray-200 bg-gray-900/20 backdrop-blur border-gray-300 rounded-lg text-lg"
        />
      </div>

      {users.data?.length > 0 ? (
        <div className="bg-gray-100 rounded-lg p-3">
          {users.data.map((user) => (
            <div
              key={user.userName}
              onClick={createchat(user.userName, user.displayName)}
              className="flex items-center p-3 border-b border-gray-200 cursor-pointer last:border-b-0"
            >
              <img
                src={user.avatarUrl}
                alt={user.userName}
                className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
              />
              <div>
                <p className="m-0 font-bold text-lg text-gray-800">
                  {user.displayName}
                </p>
                <p className="m-0 text-gray-500 text-sm">@{user.userName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">
          {users.message || "No users found."}
        </p>
      )}
    </div>
  );
};

export default Search;
