"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { authClient } from "@/auth-client";
const NavigationBar = () => {
    const { useSession } = authClient;
    const { data: session } = useSession();

    return (
        <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">P</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">
                            <a href="/" className="hover:text-primary transition-colors">
                                Promptyard
                            </a>
                        </h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/repositories" className="text-muted-foreground hover:text-primary transition-colors">
                            Repositories
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <div className="relative hidden md:block me-8">
                            <form action="/search" method="GET">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-9 w-64"
                                    name="q"
                                />
                            </form>
                        </div>
                        {!session ? (
                            <>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/signin">Sign In</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/signout">Sign Out</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
};

export default NavigationBar