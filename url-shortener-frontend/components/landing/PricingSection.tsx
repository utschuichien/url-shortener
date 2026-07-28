import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
    return (
        <section id="pricing" className="w-full py-24 bg-[#F5F5F0] relative z-0">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 tracking-tight">Bảng Giá</h2>
                    <p className="text-lg text-muted-foreground font-semibold">
                        Khởi đầu hoàn toàn miễn phí. Nâng cấp khi bạn cần những công cụ chuyên nghiệp hơn.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
                    {/* Gói Free */}
                    <div className="neobrutalist-card p-6 md:p-8 bg-white flex flex-col flex-1 hover:-translate-y-1 transition-transform">
                        <div className="mb-6 border-b-2 border-foreground pb-6">
                            <h3 className="text-xl font-bold uppercase mb-2">Gói Cơ Bản</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-foreground">Miễn Phí</span>
                            </div>
                            <p className="text-muted-foreground font-semibold mt-4">Lựa chọn tuyệt vời để làm quen với LinkFlow.</p>
                        </div>
                        
                        <div className="flex-1 space-y-4 mb-8">
                            <FeatureItem text="Giới hạn 50 link rút gọn / tháng" />
                            <FeatureItem text="Tùy chỉnh Alias cơ bản" />
                            <FeatureItem text="Thống kê cơ bản (Tổng click)" />
                            <FeatureItem text="Bảo vệ bằng mật khẩu" disabled />
                            <FeatureItem text="Export dữ liệu ra CSV" disabled />
                        </div>

                        <Link href="/register">
                            <button className="neobrutalist-button w-full py-3 text-lg bg-background text-foreground border-2 hover:bg-gray-50">
                                Bắt đầu miễn phí
                            </button>
                        </Link>
                    </div>

                    {/* Gói Pro */}
                    <div className="neobrutalist-card p-6 md:p-8 bg-primary text-white flex flex-col flex-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#1a1a1a]">
                        <div className="mb-6 border-b-2 border-foreground pb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold uppercase">Gói Chuyên Nghiệp</h3>
                                <span className="bg-secondary text-foreground text-xs font-black uppercase px-2 py-1 border-2 border-foreground shadow-[1px_1px_0_#1a1a1a]">
                                    Phổ Biến
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">50k</span>
                                <span className="text-lg font-bold text-white/80">/ tháng</span>
                            </div>
                            <p className="text-white/90 font-semibold mt-4">Dành cho cá nhân và doanh nghiệp muốn tối ưu hiệu suất.</p>
                        </div>
                        
                        <div className="flex-1 space-y-4 mb-8">
                            <FeatureItem text="Tạo link KHÔNG GIỚI HẠN" dark />
                            <FeatureItem text="Tùy chỉnh Alias độc quyền" dark />
                            <FeatureItem text="Thống kê chuyên sâu" dark />
                            <FeatureItem text="Cài đặt Password cho Link" dark />
                            <FeatureItem text="Hỗ trợ ưu tiên 24/7" dark />
                        </div>

                        <Link href="/register">
                            <button className="neobrutalist-button w-full py-3 text-lg bg-white text-primary border-2 hover:bg-gray-100 shadow-[2px_2px_0px_#1a1a1a]">
                                Nâng cấp ngay
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ text, disabled = false, dark = false }: { text: string; disabled?: boolean; dark?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            {disabled ? (
                <XCircle className="h-6 w-6 text-muted-foreground shrink-0" strokeWidth={2} />
            ) : (
                <CheckCircle2 className={`h-6 w-6 ${dark ? 'text-secondary' : 'text-primary'} shrink-0`} strokeWidth={3} />
            )}
            <span className={`font-semibold ${disabled ? 'text-muted-foreground line-through' : (dark ? 'text-white' : 'text-foreground')}`}>
                {text}
            </span>
        </div>
    );
}
