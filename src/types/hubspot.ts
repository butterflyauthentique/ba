export interface HubSpotFormData {
  portalId: string;
  formGuid: string;
  fields: {
    name: string;
    value: string | number | boolean | null;
  }[];
  context?: {
    pageUri: string;
    pageName: string;
  };
  legalConsentOptions?: {
    consent: {
      consentToProcess: boolean;
      text: string;
      communications: {
        value: boolean;
        subscriptionTypeId: number;
        text: string;
      }[];
    };
  };
}

export interface HubSpotResponse {
  inlineMessage?: string;
  redirectUri?: string;
  errors?: {
    message: string;
    errorType: string;
  }[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'tel' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  validation?: {
    message: string;
    pattern?: string;
    required?: boolean;
  };
  options?: { value: string; label: string }[];
}

export interface FormConfig {
  portalId: string;
  formId: string;
  fields: FormField[];
  submitText: string;
  successMessage: string;
  errorMessage: string;
}
