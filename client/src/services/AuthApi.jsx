import API from "./Api";


// Login function: returns user data directly from the nested structure
export const login = async (data) => {
  const response = await API.post('/users/login', data);
  return response.data; // Extract user from response
};
// Logout function
export const logout = async () => {
  const response = await API.get('/users/logout');
  return response.data;
};

// Forgot Password function
export const forgotPassword = async (email) => {
  const response = await API.post('/users/forgotPassword', { email });
  return response.data;
};

// Reset Password function
export const resetPassword = async (token, password) => {
  const response = await API.patch(`/users/resetPassword/${token}`, { password });
  return response.data;
};

// Update Password function
export const updatePassword = async (data) => {
  const response = await API.patch('/users/updatePassword', data);
  return response.data;
};

// Get current user details
export const getCurrentUser = async () => {
  const response = await API.get('/users/getme');
  return response.data; // Extract user from response
};
