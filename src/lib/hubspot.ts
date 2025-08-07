import { HubSpotFormData, HubSpotResponse } from '@/types/hubspot';

const HUBSPOT_API_URL = 'https://api.hsforms.com/submissions/v3/integration/submit';

// Get API key from environment variables
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY || '';

if (!HUBSPOT_API_KEY) {
  console.warn('HUBSPOT_API_KEY is not set. Form submissions will fail.');
}

export async function submitHubSpotForm(formData: HubSpotFormData): Promise<HubSpotResponse> {
  try {
    const { portalId, formGuid, fields, ...rest } = formData;
    
    // Construct the request payload according to HubSpot's API requirements
    const payload = {
      submittedAt: Date.now(),
      fields: fields,
      context: {
        pageUri: typeof window !== 'undefined' ? window.location.href : '',
        pageName: typeof document !== 'undefined' ? document.title : 'Contact Form',
        ...(rest.context || {})
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: 'I agree to allow Butterfly Authentique to store and process my personal data.',
          communications: [
            {
              value: true,
              subscriptionTypeId: 999, // Replace with your subscription type ID if needed
              text: 'I agree to receive marketing communications from Butterfly Authentique.'
            }
          ]
        }
      }
    };

    const response = await fetch(
      `${HUBSPOT_API_URL}/${portalId}/${formGuid}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // Clone the response before reading it
    const responseClone = response.clone();
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('HubSpot API Error:', errorData);
      } catch (e) {
        try {
          const errorText = await responseClone.text();
          console.error('Failed to parse error response:', errorText);
          errorMessage = `Failed to submit form. Status: ${response.status}. Response: ${errorText.substring(0, 200)}`;
        } catch (textError) {
          console.error('Failed to read error response as text:', textError);
          errorMessage = `Failed to submit form. Status: ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('HubSpot form submission error:', error);
    throw error;
  }
}

export function mapFormDataToHubSpotFields(
  formData: Record<string, any>,
  fields: { name: string; label: string }[]
): { name: string; value: any }[] {
  return Object.entries(formData)
    .filter(([key]) => formData[key] !== undefined && formData[key] !== null)
    .map(([key, value]) => {
      const fieldConfig = fields.find(f => f.name === key);
      return {
        name: key,
        value: value,
      };
    });
}

export function validateField(
  value: string,
  field: {
    type: string;
    required?: boolean;
    validation?: { pattern?: string; message: string };
  }
): string | null {
  if (field.required && !value?.trim()) {
    return 'This field is required';
  }

  if (!value) return null;

  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }

  if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
    return field.validation.message || 'Invalid format';
  }

  return null;
}
