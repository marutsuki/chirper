import { FC } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const AppLayout: FC = () => {
    const { isAuthenticated } = useAuth();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-screen">
                <AppSidebar />
                <main className="flex-1 overflow-auto p-6">
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AppLayout;
