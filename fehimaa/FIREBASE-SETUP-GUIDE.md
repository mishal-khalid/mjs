# Firebase Setup Guide for Fehimaa

## Complete Firebase Configuration Steps

### Step 1: Firebase Console Setup

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Select Your Project**
   - Click on "mjs-fehimaa" project (already created)
   - Or create a new project if starting fresh

### Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get Started" if not already enabled

2. **Enable Email/Password Sign-In**
   - Go to "Sign-in method" tab
   - Click on "Email/Password"
   - Enable both toggles:
     - ✅ Email/Password
     - ✅ Email link (passwordless sign-in) [optional]
   - Click "Save"

3. **Add Admin Users**
   - Go to "Users" tab
   - Click "Add user"
   - Add administrators:
     - Email: admin@mjs.edu.mv
     - Password: (create a secure password)
   - Click "Add user"
   - Repeat for additional admin accounts

### Step 3: Set Up Firestore Database

1. **Navigate to Firestore Database**
   - In the left sidebar, click "Firestore Database"
   - Click "Create database"

2. **Choose Starting Mode**
   - Select "Start in production mode" (recommended)
   - Click "Next"

3. **Choose Location**
   - Select closest region: "asia-south1" (Mumbai - closest to Maldives)
   - Click "Enable"

4. **Create Collections**

   **Collection 1: announcements**
   - Click "Start collection"
   - Collection ID: `announcements`
   - Add first document with these fields:
     ```
     title: "Welcome to Fehimaa" (string)
     content: "This is our new bulletin platform" (string)
     category: "General" (string)
     author: "MJS Admin" (string)
     authorEmail: "admin@mjs.edu.mv" (string)
     createdAt: [Click clock icon] (timestamp)
     updatedAt: [Click clock icon] (timestamp)
     status: "published" (string)
     ```

   **Collection 2: achievements**
   - Click "Start collection"
   - Collection ID: `achievements`
   - Add first document:
     ```
     title: "First Place in Science Fair" (string)
     description: "Our student won first place!" (string)
     studentName: "Student Name" (string)
     grade: "Grade 10" (string)
     category: "Academic" (string)
     date: [Click clock icon] (timestamp)
     createdAt: [Click clock icon] (timestamp)
     ```

   **Collection 3: events**
   - Click "Start collection"
   - Collection ID: `events`
   - Add first document:
     ```
     title: "Annual Sports Day" (string)
     description: "Join us for sports day!" (string)
     eventDate: [Click clock icon - set future date] (timestamp)
     location: "MJS Sports Ground" (string)
     category: "Sports" (string)
     organizer: "MJS Sports Committee" (string)
     createdAt: [Click clock icon] (timestamp)
     status: "upcoming" (string)
     ```

### Step 4: Configure Firestore Security Rules

1. **Go to Rules Tab**
   - In Firestore Database, click "Rules" tab

2. **Update Security Rules**
   Replace existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Announcements - Public read, Authenticated write
    match /announcements/{announcementId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();
    }
    
    // Achievements - Public read, Authenticated write
    match /achievements/{achievementId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();
    }
    
    // Events - Public read, Authenticated write
    match /events/{eventId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();
    }
  }
}
```

3. **Click "Publish"**

### Step 5: Enable Storage (Optional - for images)

1. **Navigate to Storage**
   - In left sidebar, click "Storage"
   - Click "Get started"

2. **Set Security Rules**
   - Choose "Start in production mode"
   - Click "Next"

3. **Choose Location**
   - Use same location as Firestore
   - Click "Done"

4. **Update Storage Rules**
   Go to Rules tab and use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Public read, authenticated write
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 6: Verify Firebase Configuration

Your Firebase config is already set in the code:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDhYfsYEJGaBvSRsY1bbujHCyKLGXH1W28",
  authDomain: "mjs-fehimaa.firebaseapp.com",
  projectId: "mjs-fehimaa",
  storageBucket: "mjs-fehimaa.firebasestorage.app",
  messagingSenderId: "509657178337",
  appId: "1:509657178337:web:e0e6aa686b5ee4697157a0",
  measurementId: "G-BXD5Q1MY6V"
};
```

This configuration is correct and will work once you complete the above steps.

## Testing Your Setup

### Test Authentication
1. Go to your login page: `login.html`
2. Try logging in with the admin credentials you created
3. You should be redirected to dashboard

### Test Data Loading
1. Go to your main page: `index.html`
2. The announcements, achievements, and events should load automatically
3. Check browser console (F12) for any errors

### Test Search
1. On the main page, use the search bar
2. Search for keywords from your test data
3. Results should filter in real-time

## Troubleshooting

### Issue: "Permission Denied" errors
**Solution:** Check Firestore security rules are published correctly

### Issue: No data appearing
**Solution:** 
- Verify collections are named exactly: `announcements`, `achievements`, `events`
- Check that documents have `createdAt` timestamp fields
- Look at browser console for specific errors

### Issue: Login not working
**Solution:**
- Verify Email/Password authentication is enabled
- Check that you've added at least one user in Authentication tab
- Verify credentials are correct

### Issue: Network errors
**Solution:**
- Check internet connection
- Verify Firebase project is not in billing suspended state
- Check browser console for specific error codes

## Production Checklist

Before going live:

- [ ] Change Firestore rules from test mode to production mode
- [ ] Set up proper admin role system
- [ ] Add all admin users to Authentication
- [ ] Test all features thoroughly
- [ ] Set up Firebase Analytics (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up automated backups
- [ ] Review and test security rules
- [ ] Add rate limiting if needed
- [ ] Set up monitoring and alerts

## Need Help?

If you encounter issues:
1. Check Firebase Console → Project Settings → Service Accounts
2. Review Firebase documentation: https://firebase.google.com/docs
3. Check browser console for specific error messages
4. Verify all configuration steps were completed

## Files Updated

Your new Fehimaa files include:
- `index.html` - Main page with glassmorphism
- `styles.css` - Complete styling with light/dark mode
- `script.js` - Firebase integration and functionality
- `login.html` - Redesigned login page
- `login-styles.css` - Login page styling
- `login-script.js` - Login functionality

All files are ready to use once Firebase is properly configured!
