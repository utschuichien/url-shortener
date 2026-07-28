'use client';

import { use } from 'react';
import Link from 'next/link';
import { useUrlStats } from '@/hooks/useUrls';
import { ArrowLeft, MousePointerClick, Calendar, ExternalLink, TrendingUp, Globe, MonitorSmartphone } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage({ params }: { params: Promise<{ shortCode: string }> }) {
    const { shortCode } = use(params);
    const { data: stats, isLoading, isError } = useUrlStats(shortCode);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mb-4"></div>
                <p className="font-semibold text-lg">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="neobrutalist-card p-4 text-center bg-destructive text-white max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">Lỗi tải dữ liệu</h2>
                <p className="font-semibold">Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.</p>
            </div>
        );
    }

    const chartData = stats.clicksByDate?.length > 0
        ? stats.clicksByDate
        : [{ date: new Date().toISOString().split('T')[0], count: 0 }];

    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full">
            {/* Header / Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b-2 border-foreground pb-5">
                <Link href="/dashboard" className="shrink-0">
                    <button className="neobrutalist-button bg-white text-foreground p-3 border-2 flex items-center justify-center">
                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                    </button>
                </Link>
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight uppercase text-foreground">Thống kê Truy cập</h1>
                    <div className="mt-2 space-y-1">
                        <p className="text-base font-semibold text-foreground flex flex-wrap items-center gap-2">
                            <span>Chi tiết cho mã rút gọn:</span>
                            <span className="bg-primary text-white px-3 py-1 border-2 border-foreground">/{shortCode}</span>
                        </p>
                        <a
                            href={stats.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 truncate max-w-lg"
                            title={stats.originalUrl}
                        >
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <span className="truncate">{stats.originalUrl}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Thống kê Tổng quan */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="neobrutalist-card bg-secondary p-4 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-foreground mb-3">
                        <h3 className="text-lg font-semibold uppercase">Tổng lượt click</h3>
                        <div className="bg-white p-2 border-2 border-foreground shadow-[1px_1px_0_#1a1a1a]">
                            <MousePointerClick className="h-5 w-5 text-foreground" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-foreground">{stats.totalClicks}</div>
                    <p className="text-sm font-semibold text-foreground mt-2 bg-white inline-block px-2 py-1 border-2 border-foreground">
                        Lượt truy cập từ mọi nguồn
                    </p>
                </div>

                <div className="neobrutalist-card bg-primary text-white p-4 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-foreground mb-3">
                        <h3 className="text-lg font-semibold uppercase">Ngày hoạt động</h3>
                        <div className="bg-white p-2 border-2 border-foreground shadow-[1px_1px_0_#1a1a1a]">
                            <Calendar className="h-5 w-5 text-foreground" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-white">{stats.clicksByDate?.length || 0}</div>
                    <p className="text-sm font-semibold text-foreground mt-2 bg-white inline-block px-2 py-1 border-2 border-foreground">
                        Số ngày có phát sinh truy cập
                    </p>
                </div>
            </div>

            {/* Biểu đồ Recharts */}
            <div className="neobrutalist-card bg-white p-4">
                <div className="mb-4 pb-3 border-b-2 border-foreground flex items-center gap-3">
                    <div className="bg-secondary p-2 border-2 border-foreground">
                        <TrendingUp className="h-5 w-5 text-foreground" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold uppercase">Lưu lượng Truy cập</h2>
                        <p className="text-sm font-semibold text-muted-foreground">Sự thay đổi số lượt click theo từng ngày</p>
                    </div>
                </div>

                <div className="h-[350px] w-full bg-muted/20 p-4 border-2 border-foreground rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#1a1a1a" strokeWidth={1} vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#1a1a1a"
                                fontSize={13}
                                fontWeight={700}
                                tickLine={{ stroke: '#1a1a1a', strokeWidth: 2 }}
                                axisLine={{ stroke: '#1a1a1a', strokeWidth: 4 }}
                                tickMargin={10}
                                tickFormatter={(val) => {
                                    if (!val) return '';
                                    const parts = val.split('-');
                                    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : val;
                                }}
                            />
                            <YAxis
                                stroke="#1a1a1a"
                                fontSize={13}
                                fontWeight={700}
                                tickLine={{ stroke: '#1a1a1a', strokeWidth: 2 }}
                                axisLine={{ stroke: '#1a1a1a', strokeWidth: 4 }}
                                tickMargin={10}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ stroke: '#1a1a1a', strokeWidth: 2, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '4px solid #1a1a1a',
                                    borderRadius: '0',
                                    boxShadow: '4px 4px 0px #1a1a1a',
                                    fontWeight: 'bold'
                                }}
                                itemStyle={{ color: '#E85D04', fontWeight: 900, fontSize: '16px' }}
                            />
                            <Line
                                type="stepAfter"
                                dataKey="count"
                                name="Lượt Click"
                                stroke="#E85D04"
                                strokeWidth={4}
                                dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: '#E85D04' }}
                                activeDot={{ r: 8, fill: '#06D6A0', stroke: '#1a1a1a', strokeWidth: 3 }}
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trình duyệt phổ biến */}
            {stats.topBrowsers && stats.topBrowsers.length > 0 && (
                <div className="neobrutalist-card bg-white p-4">
                    <div className="mb-4 pb-3 border-b-2 border-foreground flex items-center gap-3">
                        <div className="bg-primary p-2 border-2 border-foreground">
                            <MonitorSmartphone className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold uppercase">Trình duyệt / Thiết bị</h2>
                            <p className="text-sm font-semibold text-muted-foreground">Top 5 môi trường truy cập nhiều nhất</p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {stats.topBrowsers.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border-2 border-foreground bg-muted/30 hover:bg-white hover:-translate-y-0.5 transition-transform">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Globe className="h-5 w-5 shrink-0 text-primary" />
                                    <span className="font-semibold truncate" title={item.browser}>
                                        {item.browser.substring(0, 60)}{item.browser.length > 60 ? '...' : ''}
                                    </span>
                                </div>
                                <div className="shrink-0 ml-4 bg-foreground text-background px-3 py-1 font-bold border-2 border-foreground shadow-[1px_1px_0_#E85D04]">
                                    {item.clicks} click
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}