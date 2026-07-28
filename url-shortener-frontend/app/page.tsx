'use client';

import { useState } from 'react';
import { useCreateUrl } from '@/hooks/useUrls';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Zap, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CtaSection } from '@/components/landing/CtaSection';

export default function Home() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const createUrlMutation = useCreateUrl();

    const handleShorten = (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalUrl.trim()) return;

        createUrlMutation.mutate({ originalUrl, customAlias: customAlias.trim() || undefined }, {
            onSuccess: (data) => {
                setShortUrl(data.shortUrl);
                setCustomAlias('');
            },
        });
    };

    const handleCopy = () => {
        if (!shortUrl) return;
        navigator.clipboard.writeText(shortUrl);
        toast.success('Đã copy đường dẫn thành công!');
    };

    return (
        <div className="min-h-screen bg-background font-sans flex flex-col selection:bg-primary selection:text-white">
            <Header />

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-4 text-center w-full">
                
                <h1 className="text-xl md:text-8xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
                    Rút gọn.<br />
                    Chia sẻ.<br />
                    Theo dõi.
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    Biến các liên kết dài thành URLs ngắn, dễ nhớ. Theo dõi hiệu suất và chia sẻ một cách chuyên nghiệp.
                </p>

                {/* Decorative squares */}
                <div className="flex gap-4 mb-16">
                    <div className="w-16 h-12 bg-primary border-2 border-foreground shadow-[1px_1px_0px_#1a1a1a] rounded-sm"></div>
                    <div className="w-16 h-12 bg-secondary border-2 border-foreground shadow-[1px_1px_0px_#1a1a1a] rounded-sm"></div>
                </div>

                {/* Shorten Box */}
                <div className="neobrutalist-card w-full max-w-3xl p-4 bg-white text-left">
                    <p className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-4">
                        Paste your long URL here
                    </p>
                    <form onSubmit={handleShorten} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="url"
                                required
                                placeholder="https://example.com/very/long/url..."
                                className="neobrutalist-input flex-1 font-medium"
                                value={originalUrl}
                                onChange={(e) => {
                                    setOriginalUrl(e.target.value);
                                    if (shortUrl) setShortUrl(''); 
                                }}
                            />
                            <div className="flex items-center gap-2 flex-1 sm:max-w-xs relative">
                                <span className="absolute left-3 text-muted-foreground font-semibold">/</span>
                                <input
                                    type="text"
                                    placeholder="Tên tùy chỉnh (tùy chọn)"
                                    className="neobrutalist-input w-full font-medium pl-8"
                                    value={customAlias}
                                    onChange={(e) => {
                                        setCustomAlias(e.target.value);
                                        if (shortUrl) setShortUrl('');
                                    }}
                                    maxLength={15}
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="neobrutalist-button w-full py-4 text-xl flex items-center justify-center gap-3 bg-primary text-white"
                            disabled={createUrlMutation.isPending}
                        >
                            <Zap className="h-6 w-6" strokeWidth={2} />
                            {createUrlMutation.isPending ? 'Đang tạo...' : 'Shorten URL'}
                        </button>
                    </form>
                </div>

                {/* Result Box */}
                {shortUrl && (
                    <div className="neobrutalist-card w-full max-w-3xl mt-8 p-4 bg-secondary text-left flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
                            <span>Thành công!</span>
                        </div>
                        <a href={shortUrl} target="_blank" rel="noreferrer" className="text-xl font-semibold text-foreground hover:underline break-all bg-white px-4 py-2 border-2 border-foreground rounded">
                            {shortUrl}
                        </a>
                        <button 
                            className="neobrutalist-button bg-white text-foreground px-6 py-2 flex items-center gap-2 border-2 hover:shadow-[1px_1px_0px_#1a1a1a] text-sm"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4" strokeWidth={2} />
                            COPY
                        </button>
                    </div>
                )}
            </main>

            <FeaturesSection />
            <PricingSection />
            <CtaSection />

            <Footer />
        </div>
    );
}
