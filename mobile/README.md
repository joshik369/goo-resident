# Goo Resident — iPhone and Android

This is a native Expo/React Native application, not a renamed PWA. It has native sign-in, resident dashboard, payments/history, maintenance, violation notices, events/contacts, and office management screens. Both clients use the real API in `../live/`. Session tokens are stored with Expo SecureStore. No real passwords or resident records are seeded.

## Run

1. Install Node.js 24.22+ with npm on your development machine. This workspace already has dependencies installed under `mobile/node_modules`.
2. In `mobile/`, copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to your shared HTTPS backend address. Do not put a secret in this variable.
3. Run `npm install`, then `npm start` (Expo). For development only, an HTTP address is accepted by the JavaScript code; actual device networking may require platform-specific development settings. Prefer HTTPS for device testing.
4. The office creates accounts in the website. Residents activate via the supplied private web link, then use their individual email/password in the native app.

On this PC, if npm is not on PATH, the temporary local package manager is available as `node ../.tools/npm/package/bin/npm-cli.js`. This machine-specific helper is ignored by Git. Use a normal Node/npm installation on another PC.

## Build verification completed

`node node_modules/expo/bin/cli export --platform ios --platform android` succeeded for both targets. These are compiled JS/Hermes bundles, **not** signed installable IPA/APK packages. Runtime tests on iPhone/Android devices are still required. No store submission has been made.

## Signed builds and store distribution

- Configure the shared HTTPS server first. SQLite needs persistent storage; the old static Sites deployment cannot run the new backend.
- Log in to your own Expo/EAS account. Review the bundle/package identifier `com.gooresident.portal` and use an identifier registered to your developer accounts before publishing.
- `eas.json` includes internal preview and production profiles. Use EAS Build for signed Android/iOS binaries after configuring accounts and signing credentials. An Android internal preview can produce an APK. iOS distribution requires the appropriate Apple account, certificates and devices/TestFlight setup.
- Apple/Google developer accounts, signing agreements and any paid services are owner actions; no purchase or credential setup has been performed by the assistant.
- Complete device testing, privacy disclosures, store screenshots, accessibility testing, data deletion procedures and review of the lease/financial-data handling before submission.

## Current boundaries

Auto-pay saves shared apartment preferences but cannot collect payments until a provider is connected. Payment links open the configured external website. Payments shown in history are explicitly office-recorded. Account reset/activation links are manually delivered by the office; email/SMS/push delivery is not connected. The native community view is an event agenda with exact dates/times; the website also provides a month grid.

The shared form definitions live in `../live/public/forms.json`; Metro watches that folder. Keep the whole repository together for development and cloud builds.
