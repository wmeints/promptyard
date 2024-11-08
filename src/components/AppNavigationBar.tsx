"use client";

import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from "./catalyst/navbar";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { Button } from "./catalyst/button";
import { Input } from "./catalyst/input";
import { useState } from "react";
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "./catalyst/dropdown";


function SearchForm() {

    const [query, setQuery] = useState("");
    const [querySubmitted, setQuerySubmitted] = useState(false);

    function handleQueryChange(evt: React.ChangeEvent<HTMLInputElement>) {
        setQuery(evt.target.value);
    }

    function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        setQuerySubmitted(true);

        if (!query) {
            evt.preventDefault();
            return false;
        }
    }

    return (
        <>
            <form className="flex flex-row space-x-2" method="get" action="/search" onSubmit={handleSubmit}>
                <Input id="q" name="q" onChange={handleQueryChange} value={query} invalid={!query && querySubmitted} />
                <Button plain={true} type="submit">
                    <MagnifyingGlassIcon />
                </Button>
            </form>
        </>
    )
}

function UserDropdown() {
    return (
        <Dropdown>
            <DropdownButton as={NavbarItem}>
                <UserIcon />
            </DropdownButton>
            <DropdownMenu>
                <DropdownItem href="/user/settings">
                    <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                    <DropdownLabel>Log out</DropdownLabel>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}


export default function AppNavigationBar() {
    const path = usePathname();

    return (
        <Navbar>
            <NavbarItem href="/" className="max-lg:hidden">
                <NavbarLabel>Promptyard</NavbarLabel>
            </NavbarItem>
            <NavbarDivider className="max-lg:hidden" />
            <NavbarSection className="max-lg:hidden">
                <NavbarItem href="/" current={path === "/"}>Home</NavbarItem>
                <NavbarItem href="/prompts" current={path.startsWith("/prompts")}>Prompts</NavbarItem>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection className="max-lg:hidden">
                <SearchForm />
            </NavbarSection>
            <NavbarSection className="max-lg:hidden">
                <NavbarDivider />
                <UserDropdown />
            </NavbarSection>
            <NavbarSection className="lg:hidden">
                <NavbarItem href="/search">
                    <MagnifyingGlassIcon />
                </NavbarItem>
            </NavbarSection>
        </Navbar >
    )
}