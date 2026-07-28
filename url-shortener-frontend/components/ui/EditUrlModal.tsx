import React, { useState, useEffect } from 'react';

interface EditUrlModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newUrl: string) => void;
    initialUrl: string;
    isPending: boolean;
}

export function EditUrlModal({ isOpen, onClose, onConfirm, initialUrl, isPending }: EditUrlModalProps) {
    const [url, setUrl] = useState(initialUrl);

    useEffect(() => {
        setUrl(initialUrl);
    }, [initialUrl, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isPending ? onClose : undefined}
            ></div>
            <div className="neobrutalist-card bg-white p-5 max-w-sm w-full relative z-10 animate-in fade-in zoom-in duration-200 shadow-[3px_3px_0px_#1a1a1a]">
                <h3 className="text-lg font-semibold mb-4 pb-4 border-b-2 border-foreground uppercase tracking-tight">Sửa đường dẫn đích</h3>
                
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 uppercase">Đường dẫn đích (Original URL)</label>
                    <input 
                        type="url" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="neobrutalist-input w-full bg-[#F5F5F0]"
                        placeholder="https://example.com"
                        disabled={isPending}
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        className="neobrutalist-button flex-1 bg-white text-foreground border-2 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 text-base"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Hủy
                    </button>
                    <button 
                        className="neobrutalist-button flex-1 bg-primary text-foreground border-2 px-4 py-2 disabled:opacity-50 text-base"
                        onClick={() => onConfirm(url)}
                        disabled={isPending || !url.trim() || url === initialUrl}
                    >
                        {isPending ? 'Đang lưu...' : 'Lưu lại'}
                    </button>
                </div>
            </div>
        </div>
    );
}
