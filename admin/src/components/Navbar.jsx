import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img src={assets.logo} style={{ width: "max(10%, 80px)" }} alt="Logo" />
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
