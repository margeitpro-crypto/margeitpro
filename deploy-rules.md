# Deploy Firestore Rules

To deploy the updated Firestore security rules, run:

```bash
firebase deploy --only firestore:rules
```

Or if you don't have Firebase CLI installed:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `margeitpro-ee747`
3. Go to Firestore Database > Rules
4. Copy the content from `firestore.rules` file
5. Paste it in the rules editor
6. Click "Publish"

The new rules will:
- Allow authenticated users to read/write their own data
- Allow users to read billing plans and templates
- Allow users to manage their own merge logs and notifications
- Restrict admin operations to admin users only