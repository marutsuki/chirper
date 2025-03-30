import { FC, ReactNode } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MdPerson } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { BsChatRightQuoteFill } from "react-icons/bs";

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
];

const AppSidebar: FC = () => {
    return (
        <Sidebar className="p-2">
            <SidebarHeader className="p-4 flex flex-row">
                <BsChatRightQuoteFill size={24} />
                <span>Chirper</span>
            </SidebarHeader>
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
        </Sidebar>
    );
};

export default AppSidebar;
