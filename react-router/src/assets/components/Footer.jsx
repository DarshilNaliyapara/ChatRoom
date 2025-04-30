import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full bottom-0  bg-black text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Top Section */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            <p>Company Name</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400">
              Home
            </a>
            <a href="#" className="hover:text-gray-400">
              About
            </a>
            <a href="#" className="hover:text-gray-400">
              Services
            </a>
            <a href="#" className="hover:text-gray-400">
              Contact
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-6 text-sm">
          <p>© {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
