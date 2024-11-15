import Logo from "./Logo";
import MainNav from "./MainNav";
import PropTypes from "prop-types";
const Sidebar = ({ isSidebarOpen , toggleSidebar}) => {
  return (
    <aside
     onClick={toggleSidebar}
      className={`fixed  z-10 md:z-0 top-0 left-0 w-64 h-screen  bg-white dark:bg-gray-800 shadow-lg  transition-transform duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 md:block`}
    >
      <div className="py-10 px-5 flex flex-col gap-16 h-full overflow-y-auto">
        <Logo />
        <MainNav />
      </div>
    </aside>
  );
};
Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool,
}
export default Sidebar;
