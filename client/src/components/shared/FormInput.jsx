import PropTypes from "prop-types";

const FormInput = ({ disabled, type, placeholder, name, register, errors, value }) => {
  return (
    <div
      className={`w-full my-1 py-1 flex flex-col justify-start items-start px-2 ${
        errors ? "border-red-600" : ""
      }`}
    >
      <label
        htmlFor={name}
        className="text-slate-800 dark:text-gray-100 w-full text-left rtl:text-right"
      >
        {placeholder}
      </label>
      <input
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        {...(register ? register(name) : {})} // Only use register if it's passed
        className={`outline-none focus:border-orange-600 bg-white border border-gray-300 rounded-md py-2 px-2 w-full
          dark:bg-gray-700 dark:text-gray-200 
          disabled:bg-gray-200 disabled:dark:bg-gray-600 disabled:text-gray-500 
          ${errors ? "border-red-600 bg-red-200" : ""} 
          rtl:text-right`}
      />
      {errors && (
        <div>
          <p className="text-red-600">*{errors.message}</p>
        </div>
      )}
    </div>
  );
};

FormInput.displayName = "FormInput";

FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func, // Now register is optional
  errors: PropTypes.object,
  disabled: PropTypes.bool, // Add disabled to propTypes
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FormInput;
