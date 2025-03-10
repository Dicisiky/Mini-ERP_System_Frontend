import { ElementType } from "react";
import { NavLink } from "react-router";

interface NavlinkProps {
  text: string;
  path: string;
  icon: ElementType;
  className?: string;
}
const Navlink = ({ text, path, icon: Icon, className }: NavlinkProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center justify-start px-4 py-2 my-1  text-gray-600 transition-colors duration-300 transform rounded-md hover:bg-gray-300 hover:text-gray-700 
        ${isActive && "bg-gray-200 text-gray-800"} ${className && className}`
      }
    >
      <Icon className="w-6" />
      <span className="mx-2 font-medium">{text}</span>
    </NavLink>
  );
};

export default Navlink;
