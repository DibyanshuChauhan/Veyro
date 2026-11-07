import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import { SellerRoute, GuestRoute } from "../features/auth/components/ProtectedRoute";
import Unauthorized from "./Unauthorized";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <div className="min-h-screen bg-[#08080a] text-[#e5e1e4] flex flex-col font-sans-luxury">
                <main className="grow flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4af37] uppercase">
                        Haute Couture Archive
                    </span>
                    <h1 className="font-serif-luxury text-4xl sm:text-6xl text-[#f4f4f5] tracking-wide">
                        VEYRO ATELIER
                    </h1>
                    <p className="text-sm text-[#a1a1aa] font-light max-w-md">
                        Step into the curated realm of avant-garde haute couture, private salon allocations, and archival craftsmanship.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center pt-4">
                        <a
                            href="/products/create"
                            className="py-3 px-6 bg-[#d4af37] text-[#09090b] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#f2ca50] transition-colors"
                        >
                            Create Product (Seller)
                        </a>
                        <a
                            href="/login"
                            className="py-3 px-6 border border-[#27272a] text-[#a1a1aa] text-[11px] font-semibold tracking-[0.2em] uppercase hover:border-[#d4af37] hover:text-[#f4f4f5] transition-colors"
                        >
                            Client Sign In
                        </a>
                        <a
                            href="/register"
                            className="py-3 px-6 border border-[#27272a] text-[#a1a1aa] text-[11px] font-semibold tracking-[0.2em] uppercase hover:border-[#d4af37] hover:text-[#f4f4f5] transition-colors"
                        >
                            Register
                        </a>
                    </div>
                </main>
            </div>
        )
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
