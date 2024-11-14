import PropTypes from 'prop-types';

const RadioGroup = ({ name, label, options, register, errors, disabled, watch }) => {
  const selectedValue = watch(name);

  return (
    <div className="text-left rtl:text-right w-full flex flex-col my-2">
      <label className="text-slate-800 dark:text-gray-100 w-full px-2 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap justify-start items-center w-full">
        {options.map((option) => {
          const isChecked = selectedValue === option.value;

          return (
            <div
              key={option.value}
              className={`flex items-center mx-2 border ${
                isChecked ? 'border-orange-500' : 'border-gray-300'
              } p-4 rounded-md`}
            >
              <input
                type="radio"
                id={option.value}
                name={name}
                value={option.value}
                disabled={disabled}
                {...register(name, { required: `${label} is required` })}
                className={`form-radio ${
                  isChecked ? 'bg-orange-500' : 'bg-white'
                } dark:bg-gray-700 dark:text-gray-200`}
              />
              <label
                htmlFor={option.value}
                className={`px-2 ${isChecked ? 'text-orange-500' : 'text-slate-800'} dark:text-gray-200`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {errors && <p className="text-red-600 mt-1">*{errors.message}</p>}
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  watch: PropTypes.func.isRequired, // Add watch to propTypes
};

export default RadioGroup;
