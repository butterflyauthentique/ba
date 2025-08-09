import { forwardRef } from 'react';
import * as Form from '@radix-ui/react-form';

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
    name,
    label, 
    type = 'text', 
    error,
    className = '', 
    rows = 4,
    ...props 
  }, ref) => {
    const baseInputClassName = `block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${error ? 'border-red-500' : ''}`;
    const ControlComponent = type === 'textarea' ? 'textarea' : 'input';

    return (
      <Form.Field name={name} className="w-full">
        {label && (
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </Form.Label>
        )}
        <Form.Control asChild>
          <ControlComponent
            id={id}
            ref={ref as any}
            type={type === 'textarea' ? undefined : type}
            className={`${baseInputClassName} ${type === 'textarea' ? 'resize-none' : ''} ${className}`}
            rows={type === 'textarea' ? rows : undefined}
            {...props}
          />
        </Form.Control>
        {error && (
          <Form.Message className="mt-1 text-sm text-red-600">
            {error}
          </Form.Message>
        )}
      </Form.Field>
    );
  }
);

FormField.displayName = 'FormField';
