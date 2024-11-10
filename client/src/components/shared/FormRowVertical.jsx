import PropTypes from "prop-types";

function FormRowVertical({ label, error, children }) {
  return (
    <div className="flex flex-col gap-3 px-5">
      {label && <label className="font-weight-500" htmlFor={children.props.id}>{label}</label>}
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