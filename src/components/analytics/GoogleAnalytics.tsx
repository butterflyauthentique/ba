'use client'

import { GoogleAnalytics } from '@next/third-parties/google'

export default function Analytics() {
  // Use the existing Firebase measurement ID from environment variables
  const gaMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

  if (!gaMeasurementId) {
    console.warn('Google Analytics measurement ID is not set. Analytics will be disabled.')
    return null
  }

  return <GoogleAnalytics gaId={gaMeasurementId} />
}
