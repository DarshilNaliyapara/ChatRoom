import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
const [error, setError] = useState(""); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div
      className="max-w-sm mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50"
      style={{
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="userName"
            className="block mb-2 font-medium text-gray-900"
          >
            Username
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border text-gray-300 border-gray-600 bg-gray-900/20  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border text-gray-300 border-gray-600 bg-gray-900/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
        {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}  
    </div>

  );
};

export default Login;
