import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "@/app/routes";
import { AuthProvider } from "./AuthContext";

// Create the router using the routes configuration
const router = createBrowserRouter(routes);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
