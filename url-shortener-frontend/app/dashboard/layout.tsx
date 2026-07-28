'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, Link2, LogOut, User, Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, user, logout } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Route Protection
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Trong lúc đang kiểm tra Auth hoặc chưa đăng nhập thì không render nội dung Dashboard
    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Quản lý URL', href: '/dashboard', icon: Link2 },
        // Có thể thêm các trang khác ở đây
    ];

    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="hidden w-72 flex-col bg-white border-r-2 border-foreground md:flex relative z-10 shadow-[2px_0_0_#1a1a1a]">
                <div className="flex h-12 items-center border-b-2 border-foreground px-6 bg-primary">
                    <Link href="/" className="flex items-center gap-3 font-semibold text-xl text-white uppercase tracking-tight hover:-translate-y-0.5 transition-transform">
                        <LayoutDashboard className="h-8 w-8" strokeWidth={2} />
                        <span>LinkFlow</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-3 p-4 bg-muted/30">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-none border-2 px-4 py-3 text-lg font-semibold transition-all duration-200 ${
                                pathname === item.href
                                    ? 'bg-secondary border-foreground shadow-[1px_1px_0px_#1a1a1a] translate-x-1 -translate-y-1'
                                    : 'border-transparent hover:border-foreground hover:bg-white hover:shadow-[1px_1px_0px_#1a1a1a] hover:-translate-y-0.5 hover:translate-x-0.5'
                            }`}
                        >
                            <item.icon className="h-6 w-6" strokeWidth={2} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t-2 border-foreground bg-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-secondary border-2 border-foreground p-3 shadow-[1px_1px_0px_#1a1a1a]">
                            <User className="h-6 w-6" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-base font-semibold truncate">{user?.email}</span>
                            <span className="text-sm font-semibold text-muted-foreground uppercase">{user?.role}</span>
                        </div>
                    </div>
                    <button 
                        className="neobrutalist-button bg-destructive text-white w-full py-3 flex items-center justify-center gap-2 hover:bg-destructive/90"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" strokeWidth={2} />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex flex-1 flex-col overflow-hidden bg-background">
                <header className="flex h-12 items-center justify-between border-b-2 border-foreground bg-primary px-4 md:hidden relative z-20 shadow-[0_2px_0_#1a1a1a]">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-white uppercase">
                        <LayoutDashboard className="h-6 w-6" strokeWidth={2} />
                        <span>LinkFlow</span>
                    </Link>
                    <button 
                        className="cursor-pointer p-2 bg-white border-2 border-foreground shadow-[1px_1px_0_#1a1a1a] active:translate-y-0.5 active:shadow-none"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-6 w-6" strokeWidth={2} />
                    </button>
                </header>

                {/* Mobile Menu Dropdown */}
                {isSidebarOpen && (
                    <div className="border-b-2 border-foreground bg-white p-4 md:hidden relative z-10 shadow-[0_2px_0_#1a1a1a]">
                        <nav className="space-y-2 mb-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 border-2 border-transparent hover:border-foreground px-4 py-3 text-lg font-semibold hover:bg-secondary transition-all"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="h-6 w-6" strokeWidth={2} />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <button 
                            className="neobrutalist-button bg-destructive text-white w-full py-3 flex items-center justify-center gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" strokeWidth={2} />
                            Đăng xuất
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
