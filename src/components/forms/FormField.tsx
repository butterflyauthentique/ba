import { forwardRef } from 'react';

type InputProps = {
  id: string;
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'checkbox';
  placeholder?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  rows?: number;
  disabled?: boolean;
};

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ 
    id, 
    label, 
    type = 'text', 
    error, 
    className = '', 
    rows = 4,
    ...props 
  }, ref) => {
    const inputClassName = `block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'} ${className}`;
    
    return (
      <div className={className}>
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={id}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={`${inputClassName} resize-none`}
            rows={rows}
            {...props as any}
          />
        ) : (
          <input
            id={id}
            type={type}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={inputClassName}
            {...props as any}
          />
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
