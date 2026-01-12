import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 ${
      isActive ? "bg-gray-200 font-semibold" : ""
    }`;

  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink className={linkClass} to="/add">
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink className={linkClass} to="/list">
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink className={linkClass} to="/order">
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
