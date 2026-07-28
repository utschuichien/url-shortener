'use client';

import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function Header() {
    const { isAuthenticated } = useAuthStore();

    return (
        <header className="w-full bg-background border-b-2 border-foreground relative z-50">
            <div className="container mx-auto px-4 h-12 flex items-center justify-between max-w-7xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-primary border-2 border-foreground w-10 h-10 rounded-lg flex items-center justify-center shadow-[1px_1px_0px_#1a1a1a]">
                        <Link2 className="text-white h-6 w-6" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-xl tracking-tight text-foreground">LinkFlow</span>
                </Link>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center gap-4 font-semibold text-foreground">
                    <Link href="#features" className="hover:underline decoration-4 underline-offset-4 decoration-primary">Features</Link>
                    <Link href="#pricing" className="hover:underline decoration-4 underline-offset-4 decoration-primary">Pricing</Link>
                    <Link href="#about" className="hover:underline decoration-4 underline-offset-4 decoration-primary">About</Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="neobrutalist-button px-6 py-2 bg-secondary text-foreground text-sm uppercase tracking-wider">
                            Vào Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="neobrutalist-button px-6 py-2 bg-background text-foreground text-sm uppercase tracking-wider shadow-[1px_1px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] border-2">
                                Đăng Nhập
                            </Link>
                            <Link href="/register" className="neobrutalist-button px-6 py-2 bg-primary text-white text-sm uppercase tracking-wider hidden sm:block shadow-[1px_1px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a]">
                                Đăng Ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
