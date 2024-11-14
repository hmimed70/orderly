import PropTypes from 'prop-types';

const SelectInput = ({ 
  children,
  name, 
  label, 
  value, 
  disabled, 
  register, 
  errors, 
  onChange, 
}) => {
  return (
    <div className="text-left rtl:text-right w-full  flex flex-col justify-start items-start px-2 my-2">
      <label htmlFor={name} className="text-left rtl:text-right text-slate-800 dark:text-gray-100 w-full px-2 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        disabled={disabled}
        {...register(name, { required: `${label} is required` })}
        onChange={onChange}
        className={`outline-none bg-white border border-gray-300 rounded-md py-2 px-2 w-full dark:bg-gray-700 dark:text-gray-200 
          ${errors ? 'border-red-600 bg-red-200' : ''}`}
      >
       {children}
      </select>
      {errors && <p className="text-red-600 mt-1">*{errors.message}</p>}
    </div>
  );
};

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default SelectInput;
