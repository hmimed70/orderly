// src/pages/NotFound.js

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">Sorry, the page you re looking for doesnt exist.</p>
      <Link to="/" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-blue-400">
        Go to Homepage
      </Link>
    </div>
  );
}

export default NotFound;
