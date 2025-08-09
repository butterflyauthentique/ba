'use client';

import { useState, FormEvent } from 'react';
import * as Form from '@radix-ui/react-form';
import { toast } from 'react-hot-toast';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { FormField } from '@/components/forms/FormField';
import { submitHubSpotForm } from '@/lib/hubspot';

const NEWSLETTER_FORM_CONFIG = {
  portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
  formId: process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID || '',
};

export function NewsletterSignup({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      await submitHubSpotForm({
        portalId: NEWSLETTER_FORM_CONFIG.portalId,
        formGuid: NEWSLETTER_FORM_CONFIG.formId,
        fields: [
          {
            name: 'email',
            value: email,
          },
        ],
        legalConsentOptions: {
          consent: {
            consentToProcess: true,
            text: 'I agree to receive marketing communications from Butterfly Authentique.',
            communications: [
              {
                value: true,
                subscriptionTypeId: 999, // Replace with your actual subscription type ID
                text: 'I agree to receive marketing communications from Butterfly Authentique.',
              },
            ],
          },
        },
      });

      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <Form.Root onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <label htmlFor="email-newsletter" className="sr-only">
              Email address
            </label>
            <FormField
              id="email-newsletter"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              className="w-full bg-white text-gray-900 border-gray-300 focus:ring-red-500 focus:border-red-500 px-3 py-2"
              required
            />
          </div>
          <SubmitButton 
            type="submit" 
            isLoading={isSubmitting}
            className="flex-shrink-0 px-6 py-2"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </SubmitButton>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          We'll never share your email. Unsubscribe anytime.
        </p>
      </Form.Root>
    </div>
  );
}
