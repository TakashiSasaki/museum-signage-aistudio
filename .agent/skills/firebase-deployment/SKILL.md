# Firebase Hosting Deployment Skill

This skill documents how to deploy the museum-signage application to Firebase Hosting.

## Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **Firebase CLI**: Use `npx -y firebase-tools` to avoid local installation issues.

## Project Details
- **Project ID**: `museum-signage-37925190-100ae`
- **Hosting Site ID**: `museum-signage-37925190-100ae` (default)
- **Production URL**: [https://museum-signage-37925190-100ae.web.app](https://museum-signage-37925190-100ae.web.app)
- **Canonical URL**: [https://signage.museum.ehime-u.ac.jp/](https://signage.museum.ehime-u.ac.jp/)

## Deployment Procedure

### 1. Build the Application
Ensure the `dist/` directory is updated with the latest changes.
```bash
npm run build
```

### 2. Deploy to Firebase
Run the deployment command specifying the project ID to ensure it targets the correct environment.
// turbo
```bash
npx -y firebase-tools deploy --project museum-signage-37925190-100ae
```

## Verification
After deployment, verify the live site:
1. Navigate to the Production URL.
2. Check that all new UI components and logic (e.g., logo reload) are functional.
3. Verify responsiveness on target viewports (iPhone SE, XR, Pixel 7).
