import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

// Initialize App Check only when a site key is provided.
// This prevents runtime errors during local development when the key is not set.
const _recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

if (_recaptchaSiteKey) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(_recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
    // eslint-disable-next-line no-console
    console.log('Firebase App Check initialized')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to initialize Firebase App Check:', err)
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('VITE_RECAPTCHA_SITE_KEY not set — Firebase App Check not initialized')
}

export default app
