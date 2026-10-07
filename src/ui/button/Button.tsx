import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    loading && 'button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="button__spinner" aria-hidden="true" />
      ) : (
        <>
          {leftIcon && <span className="button__icon button__icon--left">{leftIcon}</span>}
          {children && <span className="button__label">{children}</span>}
          {rightIcon && <span className="button__icon button__icon--right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}