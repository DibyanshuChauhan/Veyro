import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import BuyerHome from "../features/buyer/pages/BuyerHome";
import { SellerRoute, GuestRoute } from "../features/auth/components/ProtectedRoute";
import Unauthorized from "./Unauthorized";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <BuyerHome />
    },
    {
        element: <GuestRoute />,
        children: [
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            }
        ]
    },
    {
        element: <SellerRoute />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/seller/dashboard",
                element: <Dashboard />
            },
            {
                path: "/products/create",
                element: <CreateProduct />
            }
        ]
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />
    }
]);
