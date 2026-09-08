import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUserInput, RegisterUserSchema } from '@regalamelo/shared';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import api from '../../lib/axios';
import styles from './Auth.module.css';
import { useLanguage } from '../../i18n/LanguageContext';

export const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
    const { t } = useLanguage();
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterUserInput>({
        resolver: zodResolver(RegisterUserSchema)
    });

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onSubmit = async (data: RegisterUserInput) => {
        setServerError('');
        setSuccessMessage('');
        try {
            const res = await api.post('/auth/register', data);
            setRegisteredEmail(data.email);
            setSuccessMessage(res.data.message || t('registrationSuccess'));
        } catch (err: any) {
            if (err.response) {
                // The server responded with a status code outside the 2xx range
                const status = err.response.status;
                const message = err.response.data?.error?.message;

                if (status === 409) {
                    setServerError(t('emailAlreadyRegistered'));
                } else if (status >= 400 && status < 500) {
                    setServerError(message ? t(message as any) : t('invalidData'));
                } else {
                    setServerError(t('serverError'));
                }
            } else if (err.request) {
                // The request was made but no response was received
                setServerError(t('connectionError'));
            } else {
                setServerError(t('unexpectedError'));
            }
        }
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        setServerError('');
        setSuccessMessage('');
        try {
            await api.post('/auth/resend-verification', { email: registeredEmail });
            setSuccessMessage(t('verificationEmailResent'));
            setResendCooldown(30);
        } catch (err: any) {
            setServerError(err.response?.data?.error?.message ? t(err.response.data.error.message as any) : t('serverError'));
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <Card>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>{t('createAccount')}</h2>
                {serverError && <div className={styles.serverError}>{serverError}</div>}
                {successMessage ? (
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <p style={{ color: 'green', marginBottom: '16px' }}>{successMessage}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button onClick={onToggle}>{t('goToLogin')}</Button>
                            <Button 
                                variant="outline" 
                                onClick={handleResendEmail} 
                                isLoading={isResending}
                                disabled={isResending || resendCooldown > 0}
                                style={{ opacity: resendCooldown > 0 ? 0.6 : 1 }}
                            >
                                {isResending ? t('resending') : t('resendVerificationEmail')}
                                {resendCooldown > 0 && ` (${resendCooldown})`}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <form action="#" onSubmit={handleSubmit(onSubmit)} autoComplete="on">
                    <Input
                        id="register-email"
                        label={t('emailLabel')}
                        type="email"
                        placeholder="festeggiato@esempio.com"
                        {...register('email')}
                        autoComplete="username"
                        error={errors.email?.message ? t(errors.email.message as any) : undefined}
                    />
                    <Input
                        id="register-password"
                        label={t('passwordLabel')}
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        autoComplete="new-password"
                        error={errors.password?.message ? t(errors.password.message as any) : undefined}
                    />

                    <Button type="submit" isLoading={isSubmitting} style={{ width: '100%' }}>
                        {t('registerButton')}
                    </Button>
                </form>

                <div className={styles.toggle}>
                    {t('alreadyHaveAccount')}
                    <button className={styles.toggleLink} onClick={onToggle}>{t('loginNow')}</button>
                </div>
                    </>
                )}
            </Card>
        </div>
    );
};
