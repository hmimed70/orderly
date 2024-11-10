import React from "react";
import '../../styles/spinner.css'// Import custom CSS file for the keyframes

const Spinner = () => {
  return (
    <div className="spinner mx-auto my-12 w-16 h-16 rounded-full bg-gradient-to-r from-transparent to-current animate-rotate"></div>
  );
};

export default Spinner;
