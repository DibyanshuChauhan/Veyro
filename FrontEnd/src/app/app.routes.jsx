import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/seller/pages/CreateProduct";
import EditProduct from "../features/seller/pages/EditProduct";
import Dashboard from "../features/seller/pages/Dashboard";
import BuyerHome from "../features/buyer/pages/BuyerHome";
import ProductDetail from "../features/buyer/pages/ProductDetail";
import CartPage from "../features/cart/pages/CartPage";
import { SellerRoute, GuestRoute } from "../features/auth/components/ProtectedRoute";
import Unauthorized from "./Unauthorized";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <BuyerHome />
    },
    {
        path: "/cart",
        element: <CartPage />
    },
    {
        path: "/products/:id",
        element: <ProductDetail />
    },
    {
        path: "/product/:id",
        element: <ProductDetail />
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
            },
            {
                path: "/products/edit/:id",
                element: <EditProduct />
            },
            {
                path: "/seller/products/edit/:id",
                element: <EditProduct />
            }
        ]
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />
    }
]);
