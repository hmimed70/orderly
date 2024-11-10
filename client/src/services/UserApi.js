import API from "./Api";


export const newUser = async (data) => {
  const response = await API.post('/users', data);
  return response.data;
}

export const logoutUser = async (data) => {
  const response = await API.get('/users/logout', data);
  return response.data;
}



export const getAllUsers = async (page, limit) => {
  const response = await API.get(`/users?page=${page}&limit=${limit}`); // Update the endpoint as necessary

  return response.data;
};


export const getSingleUser = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
}

export const deleteUserFn = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

export const editUserData = async (newUserData, id) => {
  const response = await API.put(`/users/${id}`, newUserData);
  return response.data;
}
export const updatePassword = async (data) => {
  const response = await API.patch('/users/updatePassword', data);
  return response.data;
};

export const updateMe = async (data) => {
  const response = await API.patch('/users/updateMe', data);
  return response.data;
};
