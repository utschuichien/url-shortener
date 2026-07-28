'use client';

import { CheckCircle2 } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const benefits = [
        "Tạo và quản lý liên kết ngắn",
        "Theo dõi hiệu suất thời gian thực",
        "Tùy chỉnh URL thương hiệu",
        "Báo cáo chi tiết & Phân tích"
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 flex w-full">
                {/* Left Column - Benefits */}
                <div className="hidden lg:flex w-[400px] bg-muted border-r-2 border-foreground p-12 flex-col justify-center">
                    <h1 className="font-semibold text-xl text-foreground mb-12 leading-tight">
                        Lợi ích của <br /> LinkFlow
                    </h1>
                    <div className="space-y-8">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="bg-foreground text-background rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
                                </div>
                                <span className="font-semibold text-xl text-foreground leading-snug">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Form Area */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-4 bg-background">
                    <div className="w-full max-w-[480px]">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
