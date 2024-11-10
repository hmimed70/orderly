import API from "./Api";

API

export const newOrder = async (data) => {
  const response = await API.post('/orders/admin', data);
  return response.data;
}



export const getAllOrders = async (page, limit, status, date) => {
  let query = `/orders/admin?page=${page}&limit=${limit}`
  if(status!=="") query += `&status=${status}`
  if(date) query += `&date=${date}`

  const response = await API.get(query); // Update the endpoint as necessary

  return response.data;
};
export const getMyOrders = async (page, limit, status, date) => {
   let query = `/orders/user/current?page=${page}&limit=${limit}`
  if(status!=="") query += `&status=${status}`
  if(date!=="" ) query += `&date=${date}`

  const response = await API.get(query); // Update the endpoint as necessary

  return response.data;
};



export const getPendingOrders = async () => {
  const response = await API.get(`/orders/user`);
  return response.data;
}
export const getSingleOrder = async (id) => {
  const response = await API.get(`/orders/admin/${id}`);
  return response.data;
}

export const getSingleOrderUser = async (id) => {
  const response = await API.get(`/orders/user/${id}`);
  return response.data;
}
export const editOrderDataUser = async (newOrderData, id) => {

  const response = await API.put(`/orders/user/${id}`, newOrderData);
  return response.data;
}

export const deleteOrderFn = async (id) => {
  const response = await API.delete(`/orders/admin/${id}`);
  return response.data;
};

export const editOrderData = async (newOrderData, id) => {
  const response = await API.put(`/orders/admin/${id}`, newOrderData);
  return response.data;
}

export const assignOrders = async () => {
  const response = await API.post(`/orders/user/assign`);
  return response.data;
}

export const confirmOrder = async (id) => {
  const response = await API.put(`/orders/user/confirm/${id}`);
  return response.data;
}
export const cancelOrder = async (id) => {

  const response = await API.put(`/orders/user/cancel/${id}`);
  return response.data;
}




export const getOrderCountByStatusAdmin = async () => {
  const response = await API.get('/orders/admin/status-counts');
  return response.data; // Assuming the response includes `totalCount` in pagination data
};
export const getOrderCountByStatusUser = async () => {
  const response = await API.get('/orders/user/status-counts');
  return response.data; // Assuming the response includes `totalCount` in pagination data
};

export const userStatistics = async (date) => {
  let query = `/orders/statistics`
  if(date!=="" ) query += `?date=${date}`

  const response = await API.get(query); // Update the endpoint as necessary
  return response.data; // Assuming the response includes `totalCount` in pagination data

}

export const getTotalOrders = async () => {
  const response = await API.get(`/orders/admin`); // Fetch with limit 1 to get the total count only
  return response.data;
};