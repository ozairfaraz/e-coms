import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import EmailVerification from "../features/auth/pages/EmailVerification";
import CreateProduct from "../features/vendors/pages/CreateProduct";
import VendorDashboard from "../features/vendors/pages/VendorDashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-email",
    element: <EmailVerification />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/vendor",
    children: [
      {
        path: "/vendor/create-product",
        element: <CreateProduct />,
      },
      {
        path: "/vendor/dashboard",
        element: <VendorDashboard />
      },
    ],
  },
  {
    path: "/",
    element: <Login />, // default redirect until home page is built
  },
]);
