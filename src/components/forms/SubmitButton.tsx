import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
};

const variantClasses = {
  primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300',
  outline: 'bg-transparent border border-current text-current hover:bg-opacity-10 focus:ring-current',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
  link: 'bg-transparent text-red-600 hover:text-red-700 hover:underline p-0 h-auto',
};

export function SubmitButton({
  variant = 'primary',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';
  
  return (
    <button
      type={props.type || 'button'}
      className={`${baseClasses} ${variantClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
