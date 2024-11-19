import API from "./Api";

export const getAllProducts = async (page, limit, date, keyword)  => {
    let query = `/products?page=${page}&limit=${limit}`
    if(date) query += `&date=${date}`
    if(keyword) query+=`&keyword=${keyword}`

    const response = await API.get(query); // Update the endpoint as necessary
    return response.data;
}
export const getSingleProduct = async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  }

  export const newProduct = async (data) => {
    const response = await API.post('/products', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
     });
    return response.data;
  }

  export const deleteProductFn = async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  };

export const editProductData = async (newOrderData, id) => {
     console.log("ezefjuàçsgud",newOrderData);
    const response = await API.put(`/products/${id}`, newOrderData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
   } );
    return response.data;
  }