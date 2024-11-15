import OrdersPage from "./pages/Admin/Orders"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserDashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Statistics from "./pages/Admin/Statistics";

import StatisticsUser from "./pages/Statistics";

import Account from "./pages/Account";

import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import AddOrder from "./pages/AddOrder";
import EditOrder from "./pages/EditOrder";
import AddUser from "./pages/Admin/AddUser";
import EditUser from "./pages/Admin/EditUser";
import ViewUser from "./pages/Admin/ViewUser";
import UpdatePassword from "./pages/UpdatePassword";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AppLayout from "./components/shared/AppLayout";
import NotFound from "./components/shared/NotFound";
import ViewOrder from "./pages/ViewOrder";
import TrashOrders from "./pages/TrashPage";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
            <Routes>
            <Route
                    element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                   <Route path="/orders" element={<OrdersPage />} />
                   <Route path="/trash" element={<TrashOrders />} />
                   <Route path="/orders/create" element={<AddOrder />} />
                   <Route path="/orders/edit/:id" element={<EditOrder />} />
                   <Route path="/orders/view/:id" element={<ViewOrder />} />
                  <Route path="/account/update-profile" element={<Account />} />
                  <Route path="/account/update-password" element={<UpdatePassword />} />
                </Route>
            <Route
              element={
                <ProtectedRoute forAdmin>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate replace to="/admin/dashboard" />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<OrdersPage />} />
                <Route path="/admin/users/create" element={<AddUser />} />
                <Route path="/admin/users/edit/:id" element={<EditUser />} />
                <Route path="/admin/users/view/:id" element={<ViewUser />} />

                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/statistics" element={<Statistics />} />
                
                </Route>
                <Route
              element={
                <ProtectedRoute >
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/statistics" element={<StatisticsUser />} />

                </Route>
         
                <Route path="/login" element={<Login  />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
      </BrowserRouter>
      <Toaster
  position="top-center"
  gutter={12}
  containerStyle={{ margin: "8px" }}
  toastOptions={{
    success: {
      duration: 3000,
    },
    error: {
      duration: 5000,
    },
    style: {
      fontSize: "16px",
      maxWidth: "500px",
      padding: "16px 24px",
      backgroundColor: "var(--toast-bg-color)", // variable for bg
      color: "var(--toast-text-color)",         // variable for text
      borderRadius: "8px",                      // to make it look polished
    },
  }}
/>

  </QueryClientProvider>
  )
}

export default App
