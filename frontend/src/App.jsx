import { useState } from "react";
import Header from "./assets/components/Header";
import Footer from "./assets/components/Footer";
import Home from "./assets/components/Home";
import { BrowserRouter, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
