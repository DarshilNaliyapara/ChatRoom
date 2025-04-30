import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./assets/components/Home.jsx";
import Chat from "./assets/components/Chat.jsx";
import Profile, { fetchgithubinfo } from "./assets/components/Profile.jsx";
import Search from "./assets/components/Search.jsx";
import Login from "./assets/components/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "chat/:conversationUserName",
        element: <Chat />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        loader: fetchgithubinfo,
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
