'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUrls, useCreateUrl, useDeleteUrl, useUpdateUrl, Url } from '@/hooks/useUrls';
import { Copy, Trash2, ExternalLink, BarChart2, LinkIcon, AlertCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EditUrlModal } from '@/components/ui/EditUrlModal';
import { Pagination } from '@/components/ui/Pagination';

export default function DashboardPage() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingUrl, setEditingUrl] = useState<Url | null>(null);
    const [page, setPage] = useState(1);
    const { data: response, isLoading } = useUrls(page, 10);
    const urls = response?.data;
    const meta = response?.meta;
    const createUrlMutation = useCreateUrl();
    const deleteUrlMutation = useDeleteUrl();
    const updateUrlMutation = useUpdateUrl();

    const handleShorten = (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalUrl.trim()) return;
        createUrlMutation.mutate({ originalUrl, customAlias: customAlias.trim() || undefined }, {
            onSuccess: () => {
                setOriginalUrl('');
                setCustomAlias('');
                setPage(1);
            },
        });
    };

    const handleCopy = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl);
        toast.success('Đã copy đường dẫn vào bộ nhớ tạm');
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4 border-b-2 border-foreground pb-6">
                <div className="bg-secondary border-2 border-foreground p-3 shadow-[1px_1px_0px_#1a1a1a]">
                    <LinkIcon className="h-8 w-8 text-foreground" strokeWidth={2} />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-foreground uppercase tracking-tight">Quản lý URL</h1>
                    <p className="text-foreground font-semibold mt-1">Tạo và theo dõi các đường dẫn rút gọn của bạn tại đây.</p>
                </div>
            </div>

            {/* Form tạo URL mới */}
            <div className="neobrutalist-card p-4 sm:p-5 bg-white relative z-10">
                <h2 className="text-lg font-bold mb-4 uppercase flex items-center gap-2">
                    <span className="bg-primary w-3 h-3 inline-block border-2 border-foreground"></span>
                    Tạo link rút gọn mới
                </h2>
                <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <input
                            type="url"
                            required
                            placeholder="https://example.com/very/long/url..."
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            className="neobrutalist-input flex-1 bg-white font-medium"
                            disabled={createUrlMutation.isPending}
                        />
                        <div className="flex items-center gap-2 flex-1 sm:max-w-xs relative">
                            <span className="absolute left-3 text-muted-foreground font-semibold">/</span>
                            <input
                                type="text"
                                placeholder="Tên tùy chỉnh (tùy chọn)"
                                className="neobrutalist-input w-full font-medium pl-8 bg-white"
                                value={customAlias}
                                onChange={(e) => setCustomAlias(e.target.value)}
                                maxLength={15}
                                disabled={createUrlMutation.isPending}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="neobrutalist-button px-4 py-2 sm:w-auto w-full text-base font-bold flex items-center justify-center gap-2"
                        disabled={createUrlMutation.isPending}
                    >
                        {createUrlMutation.isPending ? 'Đang tạo...' : 'Rút Gọn Ngay'}
                    </button>
                </form>
            </div>

            {/* Danh sách URL */}
            <div className="space-y-5 relative z-0">
                <h2 className="text-lg font-bold uppercase flex items-center gap-2">
                    <span className="bg-secondary w-3 h-3 inline-block border-2 border-foreground"></span>
                    Đường dẫn của bạn
                </h2>

                {isLoading ? (
                    <div className="neobrutalist-card p-12 bg-muted flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mb-4"></div>
                        <p className="font-semibold text-lg">Đang tải dữ liệu...</p>
                    </div>
                ) : urls && urls.length > 0 ? (
                    <div className="grid gap-4">
                        {urls.map((url: Url) => (
                            <div key={url.id} className="neobrutalist-card p-4 bg-white flex flex-col md:flex-row gap-3 md:items-center justify-between hover:-translate-y-0.5 transition-transform">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <a
                                            href={url.shortUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-lg font-bold text-primary hover:underline truncate"
                                        >
                                            {url.shortUrl}
                                        </a>
                                        <button
                                            className="neobrutalist-button bg-white text-foreground p-1.5 border-2 text-sm shrink-0"
                                            onClick={() => handleCopy(url.shortUrl)}
                                            title="Copy"
                                        >
                                            <Copy className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </div>
                                    <a
                                        href={url.originalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1 truncate max-w-full"
                                    >
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{url.originalUrl}</span>
                                    </a>
                                    <div className="mt-2 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                        <span className="bg-muted px-2 py-0.5 border-2 border-foreground inline-block">
                                            {new Date(url.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                                    <Link href={`/dashboard/links/${url.shortCode}`} className="flex-1 sm:flex-none">
                                        <button className="neobrutalist-button bg-secondary text-foreground px-3 py-2 flex items-center justify-center w-full gap-1.5 border-2 text-sm font-bold">
                                            <BarChart2 className="h-4 w-4" strokeWidth={2} />
                                            Thống kê
                                        </button>
                                    </Link>
                                    <button
                                        className="neobrutalist-button bg-yellow-400 text-foreground px-3 py-2 flex items-center justify-center gap-1.5 border-2 text-sm font-bold hover:bg-yellow-500"
                                        onClick={() => setEditingUrl(url)}
                                        title="Sửa URL gốc"
                                    >
                                        <Edit className="h-4 w-4" strokeWidth={2} />
                                        <span className="sm:hidden">Sửa</span>
                                    </button>
                                    <button
                                        className="neobrutalist-button bg-destructive text-white px-3 py-2 flex items-center justify-center gap-1.5 border-2 text-sm font-bold hover:bg-destructive/90"
                                        onClick={() => setDeleteId(url.id)}
                                        disabled={deleteUrlMutation.isPending}
                                        title="Xóa URL"
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                                        <span className="sm:hidden">Xóa URL</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="neobrutalist-card p-12 bg-[#F5F5F0] flex flex-col items-center justify-center text-center">
                        <div className="bg-white border-2 border-foreground p-4 shadow-[1px_1px_0px_#1a1a1a] mb-6 rounded-full">
                            <AlertCircle className="h-12 w-12 text-foreground" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Chưa có đường dẫn nào</h3>
                        <p className="text-muted-foreground font-semibold text-lg max-w-md">
                            Bạn chưa có đường dẫn rút gọn nào. Hãy nhập một đường dẫn dài vào ô bên trên để bắt đầu!
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {meta && (
                    <Pagination
                        page={page}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>

            {/* Modal Xác nhận Xóa */}
            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId !== null) {
                        deleteUrlMutation.mutate(deleteId, {
                            onSuccess: () => setDeleteId(null)
                        });
                    }
                }}
                title="Xác nhận xóa"
                description={
                    <>
                        Bạn có chắc chắn muốn xóa đường dẫn rút gọn này không? <br /><br />
                        <span className="bg-destructive text-white px-2 py-1 border-2 border-foreground">Hành động này không thể hoàn tác!</span>
                    </>
                }
                confirmText="Xóa ngay"
                cancelText="Hủy bỏ"
                isLoading={deleteUrlMutation.isPending}
            />

            {/* Modal Sửa URL */}
            <EditUrlModal
                isOpen={editingUrl !== null}
                onClose={() => setEditingUrl(null)}
                initialUrl={editingUrl?.originalUrl || ''}
                isPending={updateUrlMutation.isPending}
                onConfirm={(newUrl) => {
                    if (editingUrl) {
                        updateUrlMutation.mutate({ id: editingUrl.id, originalUrl: newUrl }, {
                            onSuccess: () => setEditingUrl(null)
                        });
                    }
                }}
            />
        </div>
    );
}
