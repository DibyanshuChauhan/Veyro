import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";

function App() {
  const { validateSession } = useAuth();

  // On every app boot, verify the HTTP-only cookie is still valid server-side.
  // If it is → hydrate Redux with the user from the server.
  // If it isn't (cookie deleted/expired) → Redux is cleared, user is logged out.
  useEffect(() => {
    validateSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
