import API from "./Api";

API

export const newOrder = async (data) => {
  const response = await API.post('/orders/user', data);
  return response.data;
}

export const clearFromTrash = async (data) => {
  const response = await API.post('/orders/admin/clear', data);
  return response.data;
}
export const MoveToTrashs = async (data) => {
  const response = await API.post('/orders/admin/trash', data);
  return response.data;
}
export const AddToDelivry = async (data) => {
  const response = await API.post('/delivry/user/add-to-delivery', data);
  return response.data;
}
export const recoverFromTrash = async (data) => {
  const response = await API.post('/orders/user/recover', data);
  return response.data;
}

export const getAllOrders = async (page, limit, status, date,search, myfilter) => {
  let query = `/orders/admin?page=${page}&limit=${limit}`
  if (status) {
    query += `&status=${status}`;
  } else if (myfilter) {
    const isStatus = ['inProgress', 'pending', 'confirmed', 'cancelled'].includes(myfilter);
    query += isStatus ? `&status=${myfilter}` : `&status_livraison=${myfilter}`;
  }
  if(date) query += `&date=${date}`
  if(search) query+=`&keyword=${search}`

  const response = await API.get(query);

  return response.data;
};
export const getTrashOrders  = async (page, limit, status, date, search, filter_status) => {
  let query = `/orders/user/inactive?page=${page}&limit=${limit}`
 if(status!=="") query += `&status=${status}`
 if(date!=="" ) query += `&date=${date}`
 if(search!=="") query+=`&keyword=${search}`
 if(filter_status) query+=`&status_livraison=${filter_status}`
 const response = await API.get(query); // Update the endpoint as necessary
 
 return response.data;
};
export const getMyOrders = async (page, limit, status,date, search, myfilter) => {
  let query = `/orders/user/current?page=${page}&limit=${limit}`
  if (status) {
    query += `&status=${status}`;
  } else if (myfilter) {
    const isStatus = ['inProgress', 'pending', 'confirmed', 'cancelled'].includes(myfilter);
    query += isStatus ? `&status=${myfilter}` : `&status_livraison=${myfilter}`;
  }
  if(date!=="" ) query += `&date=${date}`
  if(search!=="") query+=`&keyword=${search}`
  const response = await API.get(query); // Update the endpoint as necessary

  return response.data;
};



export const getPendingOrders = async () => {
  const response = await API.get(`/orders/user`);
  return response.data;
}
export const getSingleOrder = async (id) => {
  const response = await API.get(`/orders/user/${id}`);
  return response.data;
}

export const deleteOrderFn = async (id) => {
  const response = await API.delete(`/orders/user/${id}`);
  return response.data;
};

export const editOrderData = async (newOrderData, id) => {
  const response = await API.put(`/orders/user/${id}`, newOrderData);
  return response.data;
}



export const changeStatus = async (newStatus, orderId) => {
  const response = await API.put(`/orders/user/status/${orderId}`,{status: newStatus});
  return response.data;
}

export const assignOrders = async () => {
  const response = await API.post(`/orders/user/assign`);
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