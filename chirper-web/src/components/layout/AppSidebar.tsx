import { FC, ReactNode } from "react";
import UserSearch from "@/components/user/UserSearch";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { FaPowerOff, FaCog } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { BsChatRightQuoteFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";

type SidebarItem = {
    label: string;
    url: string;
    icon: ReactNode;
};
const items: SidebarItem[] = [
    {
        label: "Home",
        url: "/home",
        icon: <TiHome />,
    },
    {
        label: "Profile",
        url: "/profile",
        icon: <MdPerson />,
    },
    {
        label: "Settings",
        url: "/settings",
        icon: <FaCog />,
    },
];

const AppSidebar: FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const doLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Sidebar className="p-2">
            <SidebarHeader className="p-4 flex flex-row">
                <BsChatRightQuoteFill size={24} />
                <span className="font-heading font-bold">Chirper</span>
            </SidebarHeader>
            <div className="px-4 mb-4">
                <UserSearch />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarSeparator />
                <SidebarMenuButton onClick={doLogout}>
                    <FaPowerOff />
                    Logout
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
