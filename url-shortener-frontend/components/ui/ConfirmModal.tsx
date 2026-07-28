import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Xác nhận',
    description = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    isLoading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
            <div className="neobrutalist-card bg-white p-5 max-w-sm w-full animate-in fade-in zoom-in duration-200 shadow-[3px_3px_0px_#1a1a1a]">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-foreground">
                    <div className="bg-destructive text-white p-2 border-2 border-foreground shadow-[1px_1px_0px_#1a1a1a] shrink-0">
                        <AlertCircle className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-tight text-destructive">
                        {title}
                    </h3>
                </div>

                <div className="text-base font-medium text-foreground mb-6">{description}</div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        className="neobrutalist-button bg-white text-foreground flex-1 sm:flex-none px-4 py-2 border-2 text-base"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="neobrutalist-button bg-destructive text-white flex-1 sm:flex-none px-4 py-2 border-2 text-base hover:bg-destructive/90"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
