import { Zap, BarChart2, Edit, ShieldCheck } from 'lucide-react';

const features = [
    {
        title: 'Tốc độ chớp nhoáng',
        description: 'Hệ thống tối ưu hóa chuyển hướng chỉ trong vài mili-giây, mang lại trải nghiệm không độ trễ.',
        icon: Zap,
        color: 'bg-primary'
    },
    {
        title: 'Thống kê chi tiết',
        description: 'Biểu đồ trực quan giúp bạn theo dõi lượt click, trình duyệt và thiết bị truy cập mỗi ngày.',
        icon: BarChart2,
        color: 'bg-secondary'
    },
    {
        title: 'Bí danh tùy chỉnh',
        description: 'Đừng dùng những chuỗi ký tự vô nghĩa. Hãy đặt tên link mang đậm dấu ấn thương hiệu của bạn.',
        icon: Edit,
        color: 'bg-yellow-400'
    },
    {
        title: 'An toàn & Bảo mật',
        description: 'Dữ liệu được mã hóa và bảo vệ chặt chẽ. Cam kết không rò rỉ thông tin người dùng.',
        icon: ShieldCheck,
        color: 'bg-background'
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="w-full py-24 bg-white border-y-2 border-foreground relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 tracking-tight">Tính Năng Cốt Lõi</h2>
                    <p className="text-lg text-muted-foreground font-semibold">
                        LinkFlow không chỉ đơn thuần là rút gọn URL. Chúng tôi cung cấp những công cụ mạnh mẽ nhất để bạn theo dõi và làm chủ mọi đường dẫn của mình.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="neobrutalist-card p-6 bg-white hover:-translate-y-1 transition-transform group">
                            <div className={`${feature.color} w-14 h-14 border-2 border-foreground shadow-[2px_2px_0px_#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`h-7 w-7 ${feature.color === 'bg-primary' || feature.color === 'bg-foreground' ? 'text-white' : 'text-foreground'}`} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3">{feature.title}</h3>
                            <p className="font-medium text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
