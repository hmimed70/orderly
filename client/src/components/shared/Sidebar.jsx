import Logo from "./Logo";
import MainNav from "./MainNav";
import PropTypes from "prop-types";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      onClick={toggleSidebar}
      className={`fixed z-40  top-0 left-0  w-64 md:w-[70px]  h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 block md:hover:w-64 md:hover:translate-x-0 group`}
    >
      <div className="py-4 flex flex-col gap-8 h-full overflow-y-auto">
          <Logo />
        <MainNav />
        </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool,
};

export default Sidebar;
