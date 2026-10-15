---
description: Deploy to Firebase Hosting
---

This workflow automates the build and deployment of the museum-signage app to Firebase Hosting.

// turbo-all
1. Build the production application.
```bash
npm run build
```

2. Deploy the `dist` folder to Firebase Hosting.
```bash
npx -y firebase-tools deploy --project museum-signage-37925190-100ae
```

3. Verification.
Navigate to https://museum-signage-37925190-100ae.web.app/ and verify the landing page.
