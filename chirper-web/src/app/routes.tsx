import { RouteObject } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/app/routes/home/Home";
import Profile from "@/app/routes/profile/[userId]/Profile";
import Landing from "@/app/routes/(root)/Landing";
import Login from "@/app/routes/login/Login";
import Register from "@/app/routes/register/Register";
import AppRoot from "@/app/routes/(root)/AppRoot";
import ProfileRedirect from "./routes/profile/[userId]/ProfileRedirect";

// Define the routes
export const routes: RouteObject[] = [
    {
        element: <AppRoot />,
        children: [
            {
                path: "/",
                element: <Landing />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },

            {
                path: "/",
                element: <AppLayout />,
                children: [
                    {
                        path: "home",
                        element: <Home />,
                    },
                    {
                        path: "profile",
                        element: <ProfileRedirect />,
                    },
                    {
                        path: "profile/:userId",
                        element: <Profile />,
                    },
                ],
            },
        ],
    },
];
