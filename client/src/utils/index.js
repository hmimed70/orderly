export const BACKEND_URL=  "http://localhost:8000/api" 
export const SOCKET_URL = "http://localhost:8000"
//export const BACKEND_URL = "https://orderly-9j1s.onrender.com"

// Assuming `user.createdAt` is the date field from MongoDB
import wilayas from '../data/Wilaya.json';
export const formattedDate = (date) =>{
   const dateformated = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    return dateformated  ;
} 

export const getWilayaName = (wilayaCode) => {
  const wilaya = wilayas.find((w) => w.code === wilayaCode);
  return wilaya ? wilaya.nom : "Unknown";
};  

export const getCurrentMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
  const endOfMonth = new Date(); // Current date (up to now)
  return [startOfMonth, endOfMonth];
};
