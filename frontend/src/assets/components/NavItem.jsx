import { Link, NavLink, useLocation } from "react-router-dom";
export default function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={(isActive) =>
        `group relative ${
          isActive ? "text-gray-200" : "text-white"
        } cursor-pointer hover:scale-120 transition-transform duration-200 px-2`
      }
    >
      <img src={icon} alt={label} className="w-6 h-6 mx-auto invert " />
      <span>{label}</span>
    </NavLink>
  );
}
