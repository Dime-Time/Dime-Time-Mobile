# Android Build Setup Guide for Dime Time

## Prerequisites ✅
- ✅ Android Studio installed
- ✅ Google Play Console Account ($25 one-time fee)
- ✅ Capacitor Android project configured

## Build Configuration Files

### 1. Google Play Console Setup
- **Package Name**: `com.dimetime.app` (must match iOS bundle ID)
- **App Name**: "Dime Time"
- **Category**: Finance
- **Content Rating**: Mature 17+ (Financial content, simulated investment)

### 2. App Module Configuration (android/app/build.gradle)
```gradle
android {
    namespace "com.dimetime.app"
    compileSdkVersion rootProject.ext.compileSdkVersion
    defaultConfig {
        applicationId "com.dimetime.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}
```

### 3. Build Commands

```bash
# Navigate to project root
cd /path/to/dime-time

# Build web assets
npm run build

# Sync Capacitor files
npx cap sync android

# Build APK
npx cap build android

# Or open in Android Studio
npx cap open android
```

### 4. Android Studio Configuration

#### Signing Configuration
1. **Build → Generate Signed Bundle/APK**
2. **Choose Android App Bundle (AAB)**
3. **Create new keystore**:
   ```
   Keystore Path: dime-time-release.keystore
   Password: [SECURE_PASSWORD]
   Key Alias: dime-time-key
   Key Password: [SECURE_PASSWORD]
   Validity: 25 years
   ```

#### App Permissions (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 5. App Assets Checklist
- ✅ App Icon: 512x512px (generated: `attached_assets/generated_images/Dime_Time_app_icon_b9252f78.png`)
- ✅ Feature Graphic: 1024x500px (generated: `attached_assets/generated_images/Play_Store_feature_graphic_aea40d77.png`)
- ⚠️ Screenshots: Need Android screenshots (Phone, 7" Tablet, 10" Tablet)

### 6. Google Play Console Submission

#### Step 1: Create App
1. Go to Google Play Console
2. Create App
3. Fill in app details:
   ```
   App Name: Dime Time
   Default Language: English (United States)
   App or Game: App
   Free or Paid: Free (with subscription)
   ```

#### Step 2: Store Listing
```
Short Description: Turn spare change into debt freedom with automated round-up technology.

Full Description: [Use content from app-descriptions.md]

App Category: Finance
Tags: debt payoff, round up, financial management

Contact Details:
Website: https://your-domain.com
Email: support@dimetime.app
Privacy Policy: https://dimetime.replit.app/privacy-policy.html
```

#### Step 3: Content Rating
- **Financial Services**: Yes
- **User-Generated Content**: No
- **Data Collection**: Yes (financial data)
- **Age Rating**: Everyone with financial content warning

#### Step 4: App Content
- **Privacy Policy**: Required - link to your privacy policy
- **App Access**: Not restricted
- **Ads**: No ads in app
- **Content Guidelines**: Compliant with financial app policies

### 7. Internal Testing Setup

#### Create Internal Testing Track
1. Go to **Testing → Internal Testing**
2. **Create New Release**
3. **Upload AAB file**
4. **Release Name**: v1.0.0-beta
5. **Release Notes**:
   ```
   🎉 Welcome to Dime Time Beta Testing!
   
   Features to Test:
   ✅ Round-up calculation simulation
   ✅ Debt tracking and goal setting  
   ✅ User interface and navigation
   ✅ Optional crypto investment flow
   
   Beta Notes:
   - All financial features are simulated for safety
   - No real money transactions during testing
   - Your feedback helps us improve!
   
   Focus Areas:
   - App performance and stability
   - User experience and clarity
   - Feature requests and suggestions
   ```

#### Add Testers
1. **Testers Tab**
2. **Create Email List**
3. **Add tester emails** (up to 100 for internal testing)
4. **Share Testing Link**

### 8. Required Screenshots (Sizes)
- **Phone Screenshots**: 
  - 16:9 aspect ratio
  - Minimum 320px
  - Maximum 3840px
- **7-inch Tablet**: 
  - Optional but recommended
- **10-inch Tablet**: 
  - Optional but recommended

### 9. App Bundle Optimization
```bash
# Build optimized AAB
cd android
./gradlew bundleRelease

# Check bundle contents
bundletool build-apks --bundle=app/build/outputs/bundle/release/app-release.aab --output=dime-time.apks
```

### 10. Testing Distribution Methods

#### Internal Testing (Recommended for Beta)
- **Capacity**: Up to 100 testers
- **Review Time**: Instant
- **Access**: Email invitation required
- **Duration**: Unlimited

#### Closed Testing
- **Capacity**: Up to 20,000 testers
- **Review Time**: Few hours
- **Access**: Email + opt-in URL
- **Duration**: Unlimited

## Build Process Automation

### Capacitor Build Script
```json
// package.json scripts
{
  "scripts": {
    "build:android": "npm run build && npx cap sync android && npx cap build android",
    "build:ios": "npm run build && npx cap sync ios",
    "deploy:android": "npm run build:android && echo 'Upload AAB to Play Console'",
    "deploy:ios": "npm run build:ios && echo 'Archive in Xcode'"
  }
}
```

## Security Configuration

### Network Security Config (res/xml/network_security_config.xml)
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">api.silamoney.com</domain>
        <domain includeSubdomains="true">api.coinbase.com</domain>
        <domain includeSubdomains="true">production.plaid.com</domain>
    </domain-config>
    <!-- Debug only - remove for production -->
    <debug-overrides cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </debug-overrides>
</network-security-config>
```

## Launch Day Checklist
- [ ] Google Play Console account active ($25 paid)
- [ ] App signed with production keystore
- [ ] All required screenshots captured
- [ ] Store listing complete
- [ ] Content rating submitted
- [ ] Internal testing track configured
- [ ] Beta tester email list ready

## Beta Testing Timeline
- **Upload AAB**: Instant
- **Internal Testing**: Available immediately
- **Tester Invitations**: Can be sent right away
- **Closed Testing**: ~2-4 hours review if needed