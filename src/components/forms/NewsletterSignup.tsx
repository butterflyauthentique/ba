'use client';

import { useState, FormEvent } from 'react';
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email-newsletter" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow">
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
                className="w-full"
                required
              />
            </div>
            <SubmitButton 
              type="submit" 
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </SubmitButton>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We'll never share your email. Unsubscribe anytime.
          </p>
        </div>
      </form>
    </div>
  );
}
