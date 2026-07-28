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
import { AtSign, Lock, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Vui lòng nhập email' })
        .email({ message: 'Email không đúng định dạng' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const loginAction = useAuthStore((state) => state.login);

    const [globalError, setGlobalError] = useState('');

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setGlobalError('');
        try {
            const response = await authService.login(values.email, values.password);
            const { user, accessToken } = response.data;
            loginAction(user, accessToken);
            router.push('/dashboard');
        } catch (error) {
            const err = error as any;
            let errorMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
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
                    LinkFlow - Đăng Nhập
                </h2>

                {globalError && (
                    <div className="mb-6 p-4 text-sm font-semibold border-2 border-foreground text-foreground bg-destructive/10 rounded-md">
                        {globalError}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Field Email */}
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

                    {/* Field Mật khẩu */}
                    <div className="space-y-2 relative">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-semibold flex items-center gap-2">
                                <Lock className="h-5 w-5" strokeWidth={2} />
                                <span>Mật khẩu</span>
                            </div>
                            <input
                                type="password"
                                placeholder=""
                                className="neobrutalist-input w-full pl-36 bg-white"
                                {...form.register('password')}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                                <EyeOff className="h-5 w-5" strokeWidth={2} />
                            </div>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-sm font-semibold text-destructive">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-foreground">
                        <input type="checkbox" className="w-5 h-5 border-2 border-foreground rounded-sm accent-primary" id="remember" />
                        <label htmlFor="remember" className="cursor-pointer">Nhớ mật khẩu</label>
                    </div>

                    <button
                        type="submit"
                        className="neobrutalist-button w-full py-4 text-xl"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>

                <div className="mt-6 text-center font-semibold">
                    <a href="#" className="text-secondary hover:underline decoration-2 underline-offset-4">
                        Quên mật khẩu?
                    </a>
                </div>

                <div className="my-8 border-t-2 border-foreground"></div>

                <div className="space-y-4">
                    <button className="neobrutalist-button w-full py-4 bg-white text-foreground border-2 hover:shadow-[1px_1px_0px_#1a1a1a] flex items-center justify-center gap-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Đăng nhập bằng Google
                    </button>
                </div>

                <div className="mt-8 text-center font-semibold text-foreground">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="hover:underline decoration-2 underline-offset-4">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
