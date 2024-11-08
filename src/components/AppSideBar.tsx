"use client";

import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarDivider, SidebarHeader, SidebarItem, SidebarSection } from "./catalyst/sidebar";

export default function AppSideBar() {
    const path = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <h1 className="text-2xl font-bold">Promptyard</h1>
            </SidebarHeader>
            <SidebarBody>
                <SidebarSection>
                    <SidebarItem href="/" current={path === "/"}>Home</SidebarItem>
                    <SidebarItem href="/prompts" current={path.startsWith("/prompts")}>Prompts</SidebarItem>
                </SidebarSection>
                <SidebarDivider />
                <SidebarSection>
                    <SidebarItem href="/user/settings" current={path === "/user/settings"}>Settings</SidebarItem>
                    <SidebarItem href="#">Log out</SidebarItem>
                </SidebarSection>
            </SidebarBody>
        </Sidebar>
    );
}