import PropTypes from 'prop-types';

const TextArea = ({ disabled, placeholder, name, register, errors }) => {
  return (
    <div className={`w-full my-1 py-1 flex flex-col justify-start items-start px-2 ${errors ? 'border-red-600' : ''}`}>
      <label 
        htmlFor={name} 
        className="text-slate-800 dark:text-gray-100 w-full text-left rtl:text-right">
        {placeholder}
      </label>
      <textarea
        disabled={disabled}
        placeholder={placeholder}
        name={name}
        {...(register ? register(name) : {})} // Only use register if it's passed
        className={`outline-none focus:border-orange-600 bg-white border border-gray-300 rounded-md py-2 px-2 w-full h-20 dark:bg-gray-700 dark:text-gray-200 
          ${errors ? 'border-red-600 bg-red-200' : ''} rtl:text-right`}
      />
      {errors && <div><p className="text-red-600">*{errors.message}</p></div>}
    </div>
  );
};

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};

export default TextArea;
