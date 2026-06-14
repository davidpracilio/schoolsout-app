import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check'

// Must be set before initializeAppCheck is called
if (import.meta.env.DEV && import.meta.env.VITE_APPCHECK_DEBUG_TOKEN) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN
}

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
})

const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true
})

export async function getAppCheckToken() {
  try {
    const { token } = await getToken(appCheck)
    return token
  } catch (err) {
    console.warn('App Check token unavailable:', err)
    return null
  }
}
