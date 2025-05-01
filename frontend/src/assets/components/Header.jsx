import { Link, NavLink, useLocation } from "react-router-dom";
import NavItem from "./Navitem.jsx";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  // Convert pathname to a title (e.g. "/about" => "About")
  const getPageTitle = (path) => {
    if (path === "/") return "Home";
    const page = path.split("/")[1];
    return page.charAt(0).toUpperCase() + page.slice(1);
  };

  const pageTitle = getPageTitle(location.pathname);

  const logout = async () => {
    const response = await fetch("http://localhost:8000/api/v1/user/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  const fetchCurrentUser = async () => {
    const response = await fetch("http://localhost:8000/api/v1/user/current", {
      method: "GET",
      credentials: "include",
    });
    const userresponse = await response.json();
    setUser(userresponse.data);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <header className="bg-gray-900/50 backdrop-blur p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Page Title */}
        <div className="text-center md:text-left text-2xl font-semibold text-gray-100 mb-4 md:mb-0">
          {pageTitle}
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <NavItem
            icon="https://img.icons8.com/ios-filled/50/home.png"
            label="Home"
            to="/"
          />
          <NavItem
            icon="https://img.icons8.com/ios-filled/50/search.png"
            label="Search"
            to="/search"
          />
          <NavItem
            icon="https://img.icons8.com/ios-filled/50/user.png"
            label="Profile"
            to="/profile"
          />
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <img
                src={user.avatarUrl || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-sm text-gray-100">
                <div className="font-semibold">
                  {user.displayName || user.name}
                </div>
                <div className="text-gray-400">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
