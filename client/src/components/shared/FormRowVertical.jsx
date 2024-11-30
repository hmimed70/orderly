import PropTypes from "prop-types";

function FormRowVertical({ label, error, children }) {
  return (
    <div className="w-full my-1 py-1 flex flex-col justify-start items-start px-2">
      {label && <label className="text-slate-800 dark:text-gray-100 w-full text-left rtl:text-right" htmlFor={children.props.id}>{label}</label>}
      {children}
      {error && <span className="text-red-600 text-md">{error}</span>}
    </div>
  );
}
FormRowVertical.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node
}
export default FormRowVertical;