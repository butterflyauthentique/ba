'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { FormField } from '@/components/forms/FormField';
import { toast } from 'react-hot-toast';
import { submitHubSpotForm, mapFormDataToHubSpotFields } from '@/lib/hubspot';

const CONTACT_FORM_CONFIG = {
  portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
  formId: process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID || '',
  fields: [
    {
      name: 'firstname',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Your first name',
    },
    {
      name: 'lastname',
      label: 'Last Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Your last name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'your.email@example.com',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      placeholder: '(123) 456-7890',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      required: true,
      placeholder: 'How can we help you?',
    },
  ],
};

export function ContactForm() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    CONTACT_FORM_CONFIG.fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (field.type === 'email' && formData[field.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.name])) {
        newErrors[field.name] = 'Please enter a valid email address';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const hubspotFields = mapFormDataToHubSpotFields(
        formData,
        CONTACT_FORM_CONFIG.fields
      );

      await submitHubSpotForm({
        portalId: CONTACT_FORM_CONFIG.portalId,
        formGuid: CONTACT_FORM_CONFIG.formId,
        fields: hubspotFields,
      });

      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({});
      
      // Optionally redirect after successful submission
      // router.push('/thank-you');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CONTACT_FORM_CONFIG.fields.map((field) => (
          <div 
            key={field.name}
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            <FormField
              id={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              error={errors[field.name]}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <SubmitButton 
          type="submit" 
          isLoading={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </SubmitButton>
      </div>
    </form>
  );
}
