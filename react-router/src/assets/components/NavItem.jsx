import { Link, NavLink, useLocation } from 'react-router-dom';
export default function NavItem({ icon, label, to }) {
    return (
        <NavLink to={to} className={(isActive) => `group relative ${isActive ? "text-gray-400" : "text-white"} cursor-pointer hover:scale-150 transition-transform duration-200 px-2`}>
            <img src={icon} alt={label} className="w-6 h-6 mx-auto invert " />

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-80 transition-transform duration-200 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                {label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black" />
            </div>
        </NavLink>
    );
}