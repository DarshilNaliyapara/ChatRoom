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
    <>
    
      <div className="p-6 flex flex-row items-center justify-between space-x-4 z-50">
        <div className="text-center mt-4 text-4xl font-semibold text-gray-100">
          <label>{pageTitle}</label>
        </div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 text-black bg-gray-200 mr-2 hover:bg-gray-400 rounded-md text-sm"
            >
              Login
            </Link>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatarUrl || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-sm text-gray-100">
                  <div className="font-semibold">
                    {user.displayName || user.name}
                  </div>
                  <div className="text-gray-300">{user.email}</div>
                </div>
              </div>
              <Link
                onClick={logout}
                className="px-4 py-2 text-black bg-gray-200 mr-2 hover:bg-gray-400 rounded-md text-sm"
              >
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Bottom Nav Bar */}
      <div className="fixed z-40 bottom-6 left-1/2 hover:scale-110 transition-transform duration-150 -translate-x-1/2 px-6 py-3 w-auto max-w-4xl flex items-center justify-center gap-6 backdrop-blur bg-white/20 shadow rounded-full">
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
      </div>
    </>
  );
}
