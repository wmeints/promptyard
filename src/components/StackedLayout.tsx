"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'; // Added import
import Link from 'next/link';
import type { Session } from 'next-auth';

const userNavigation = [
    { name: 'Settings', href: '/user/settings' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface UserProfile {
    name?: string | null
    email?: string | null
    image?: string | null
}

function ProfileDropdown({ session, user }: { session: Session | undefined | null, user: UserProfile | undefined | null }) {
    function handleSignIn() {
        if (!session) {
            signIn();
            return false;
        }
    }

    function handleSignOut() {
        signOut();
    }

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={handleSignIn}>
                    <span className="absolute -inset-1.5" />
                    {session && (
                        <>
                            <span className="me-2">{user?.name}</span>
                            <UserIcon className="h-8 w-8 rounded-full text-gray-400" />
                        </>
                    )}
                    {!session && (
                        <>
                            <span>Sign in</span>
                            <UserIcon className="h-8 w-8 rounded-full text-gray-400" />
                        </>
                    )}
                </MenuButton>
            </div>{session && (
                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                            <a
                                href={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                            >
                                {item.name}
                            </a>
                        </MenuItem>
                    ))}

                    <MenuItem>
                        <a
                            onClick={handleSignOut}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                            Sign out
                        </a>
                    </MenuItem>
                </MenuItems>
            )}

        </Menu>
    );
}

function InnerStackedLayout({ children }: { children: ReactNode }) {
    const path = usePathname();
    const { data: session } = useSession();

    const navigation = [
        { name: 'Home', href: '/', current: path === '/' },
        { name: 'Prompts', href: '/prompts', current: path.startsWith('/prompts') },
    ]

    const user = session?.user;

    function handleSignIn() {
        if (!session) {
            signIn();
            return false;
        }
    }

    function handleSignOut() {
        signOut();
    }

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="border-b border-gray-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/" className="pt-1 text-indigo-500 font-bold">Promptyard</Link>
                                </div>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current
                                                    ? 'border-indigo-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {/* Profile dropdown */}
                                <ProfileDropdown user={user} session={session} />
                            </div>
                            <div className="-mr-2 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pb-3 pt-4">
                            {session && (
                                <>
                                    <div className="flex items-center px-4">
                                        <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        {userNavigation.map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                        <DisclosureButton
                                            as="a"
                                            onClick={handleSignOut}
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        >
                                            Sign out
                                        </DisclosureButton>
                                    </div>
                                </>
                            )}
                            {!session && (
                                <DisclosureButton
                                    as="a"
                                    onClick={handleSignIn}
                                    href="#"
                                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Sign in
                                </DisclosureButton>
                            )}

                        </div>
                    </DisclosurePanel>
                </Disclosure>

                <div className="py-10">
                    {children}
                </div>
            </div>
        </>
    )
}

export default function StackedLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <InnerStackedLayout>{children}</InnerStackedLayout>
        </SessionProvider>
    )
}