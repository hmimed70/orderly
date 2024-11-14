import PropTypes from 'prop-types';
 const Row = ({children}) => {
  return(
     <div className=" w-full  text-center flex flex-col sm:flex-row justify-center items-center px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
      {children}
    </div>
  )
} 

Row.propTypes = {
  children: PropTypes.node.isRequired,
}
export default Row;