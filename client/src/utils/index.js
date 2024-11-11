//export const BACKEND_URL=  "http://localhost:8000" 
export const BACKEND_URL = "http://orderly-9j1s.onrender.com"

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
