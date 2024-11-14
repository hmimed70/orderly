import PropTypes from 'prop-types';
const ColumnVisibilityToggle = ({ visibleColumns, toggleColumnVisibility }) => {
  return (
    <div className="mt-4 mb-10  justify-center items-center flex space-x-2 space-y-2 text-center max-h-7 flex-wrap">
      {Object.keys(visibleColumns).map(column => (
        <span
          key={column}
          onClick={() => toggleColumnVisibility(column)}
          className={`px-3 py-1 rounded-md cursor-pointer ${
            visibleColumns[column]
              ? "bg-orange-500 text-white dark:bg-orange-600"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          } hover:bg-orange-600 dark:hover:bg-orange-500`}
        >
          {column.replace("_", " ")}
        </span>
      ))}
    </div>
  );
};
ColumnVisibilityToggle.propTypes = {
  visibleColumns: PropTypes.object.isRequired,
  toggleColumnVisibility: PropTypes.func.isRequired
}
export default ColumnVisibilityToggle;
