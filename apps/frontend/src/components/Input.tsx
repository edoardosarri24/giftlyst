import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        return (
            <div className={`${styles.container} ${className}`}>
                {label && <label htmlFor={props.id} className={styles.label}>{label}</label>}
                <div className={styles.inputWrapper}>
                    <input
                        ref={ref}
                        type={inputType}
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
