'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthLayout } from '@/components/AuthLayout';
import { User, AtSign, Lock } from 'lucide-react';

const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: 'Vui lòng nhập email' })
            .email({ message: 'Email không đúng định dạng' }),
        password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
        confirmPassword: z.string().min(1, { message: 'Vui lòng nhập lại mật khẩu' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const loginAction = useAuthStore((state) => state.login);
    const [globalError, setGlobalError] = useState('');

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const watchPassword = form.watch('password');

    const onSubmit = async (values: RegisterFormValues) => {
        setGlobalError('');
        try {
            const response = await authService.register(values.email, values.password);
            const { user, accessToken } = response.data;
            loginAction(user, accessToken);
            router.push('/dashboard');
        } catch (error) {
            const err = error as any;
            let errorMsg = 'Đăng ký thất bại. Vui lòng kiểm tra lại.';
            const backendMsg = err.response?.data?.message;
            if (backendMsg) {
                errorMsg = Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg;
            }
            setGlobalError(errorMsg);
        }
    };

    return (
        <AuthLayout>
            <div className="neobrutalist-card p-4 sm:p-12 w-full">
                <h2 className="text-xl font-semibold text-foreground text-center mb-8">
                    Tạo tài khoản LinkFlow
                </h2>

                {globalError && (
                    <div className="mb-6 p-4 text-sm font-semibold border-2 border-foreground text-foreground bg-destructive/10 rounded-md">
                        {globalError}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2 relative">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-semibold flex items-center gap-2">
                                <User className="h-5 w-5" strokeWidth={2} />
                                <span>Họ và tên</span>
                            </div>
                            <input
                                placeholder=""
                                className="neobrutalist-input w-full pl-36 bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 relative">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-semibold flex items-center gap-2">
                                <AtSign className="h-5 w-5" strokeWidth={2} />
                                <span>Email</span>
                            </div>
                            <input
                                placeholder=""
                                className="neobrutalist-input w-full pl-28 bg-white"
                                {...form.register('email')}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-sm font-semibold text-destructive">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 relative">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-semibold flex items-center gap-2">
                                <Lock className="h-5 w-5" strokeWidth={2} />
                                <span>Mật khẩu</span>
                            </div>
                            <input
                                type="password"
                                placeholder=""
                                className="neobrutalist-input w-full pl-36 bg-white pr-24"
                                {...form.register('password')}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-end gap-1 h-4">
                                <div className="w-1.5 h-2 bg-green-500 border border-black rounded-sm"></div>
                                <div className="w-1.5 h-3 bg-green-500 border border-black rounded-sm"></div>
                                <div className="w-1.5 h-4 bg-green-500 border border-black rounded-sm"></div>
                            </div>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-sm font-semibold text-destructive">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                        
                        {!form.formState.errors.password && watchPassword.length > 0 && (
                            <div className="mt-2 text-center">
                                <div className="h-3 w-full bg-green-400 border-2 border-foreground rounded-full mb-1"></div>
                                <span className="text-xs font-semibold uppercase">Mạnh</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 relative">
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                className="neobrutalist-input w-full bg-white font-semibold placeholder:text-foreground"
                                {...form.register('confirmPassword')}
                            />
                        </div>
                        {form.formState.errors.confirmPassword && (
                            <p className="text-sm font-semibold text-destructive">
                                {form.formState.errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-foreground">
                        <input type="checkbox" className="w-5 h-5 border-2 border-foreground rounded-sm accent-primary" id="tos" required />
                        <label htmlFor="tos" className="cursor-pointer">
                            Tôi đồng ý với <a href="#" className="underline decoration-2 underline-offset-4">Điều khoản Dịch vụ</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="neobrutalist-button w-full py-4 text-xl"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="mt-8 text-center font-semibold text-foreground">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="hover:underline decoration-2 underline-offset-4 text-primary">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
