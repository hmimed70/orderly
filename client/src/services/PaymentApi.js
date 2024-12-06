import API from "./Api";

// Request a new payment
export const requestPayment = async (data) => {
  const response = await API.post('/payments/request',data);
  return response.data;
}
export const getSinglePayment = async (id) => {
  const response = await API.get(`/payments/user/${id}`);
  return response.data;
}
// Get payment history for the authenticated user
export const getMyPaymentHistory = async () => {
  const response = await API.get(`/payments/history`);
  return response.data;
}
export const getUserPaymentHistory = async (page, limit, id) => {
  
  let query = `/payments/history?page=${page}&limit=${limit}`
  if(id && id!==null) query += `&userId=${id}`
    const response = await API.get(query);
    return response.data;
  }
  
// Handle a payment request (e.g., accept, refuse, or mark as done)
export const handlePayment = async ( PaymentHandleData, id ) => {
   
  const response = await API.put(`/payments/handle/${id}`, PaymentHandleData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
  
}
