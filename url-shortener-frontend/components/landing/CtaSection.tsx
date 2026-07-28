import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
    return (
        <section className="w-full py-24 bg-background border-t-2 border-foreground">
            <div className="max-w-5xl mx-auto px-4">
                <div className="neobrutalist-card bg-secondary border-4 p-8 md:p-16 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-[8px_8px_0px_#1a1a1a]">
                    <h2 className="text-4xl md:text-5xl font-black uppercase text-foreground mb-6 tracking-tight relative z-10">
                        Sẵn sàng kiểm soát<br />mọi liên kết của bạn?
                    </h2>
                    <p className="text-lg md:text-xl text-foreground font-semibold mb-10 max-w-2xl mx-auto relative z-10">
                        Tham gia cùng hàng ngàn người dùng khác. Đăng ký ngay hôm nay để trải nghiệm toàn bộ sức mạnh của LinkFlow.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 w-full sm:w-auto">
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="neobrutalist-button px-8 py-4 text-xl bg-primary text-white border-2 border-foreground flex items-center justify-center gap-3 hover:-translate-y-1 w-full sm:w-auto shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_#1a1a1a]">
                                Bắt đầu hoàn toàn miễn phí
                                <ArrowRight className="h-6 w-6" strokeWidth={3} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
