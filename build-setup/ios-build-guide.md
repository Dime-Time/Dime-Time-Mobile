# iOS Build Setup Guide for Dime Time

## Prerequisites ✅
- ✅ Xcode installed
- ✅ iOS Developer Account ($99/year)
- ✅ Capacitor iOS project configured

## Build Configuration Files

### 1. App Store Connect Setup
- **Bundle ID**: `com.dimetime.app` (must be unique)
- **App Name**: "Dime Time"
- **SKU**: `dime-time-ios`
- **Primary Language**: English (U.S.)

### 2. Required App Information
```
Name: Dime Time
Subtitle: Get Out of Debt One Dime at a Time
Category: Finance
Age Rating: 17+ (Financial/Medical Content)
```

### 3. Version Information
```
Version: 1.0.0
Build: 1
```

### 4. Build Commands

```bash
# Navigate to project root
cd /path/to/dime-time

# Build web assets
npm run build

# Sync Capacitor files
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 5. Xcode Configuration

#### Signing & Capabilities
1. **Team**: Select your Apple Developer team
2. **Bundle Identifier**: com.dimetime.app
3. **Signing Certificate**: iOS Developer
4. **Provisioning Profile**: Xcode Managed Profile

#### Required Capabilities
- **App Transport Security**: Allow arbitrary loads for development
- **Background Modes**: Background fetch (for financial data updates)

#### Info.plist Additions
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>api.silamoney.com</key>
        <dict>
            <key>NSExceptionRequiresForwardSecrecy</key>
            <false/>
        </dict>
        <key>api.coinbase.com</key>
        <dict>
            <key>NSExceptionRequiresForwardSecrecy</key>
            <false/>
        </dict>
    </dict>
</dict>
<key>CFBundleDisplayName</key>
<string>Dime Time</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### 6. App Assets Checklist
- ✅ App Icon: 1024x1024px (generated: `attached_assets/generated_images/Dime_Time_app_icon_b9252f78.png`)
- ✅ Launch Screen: Configured via Capacitor
- ⚠️ Screenshots: Need iPhone screenshots (6.5", 5.5", 4.7", iPad Pro)

### 7. TestFlight Submission Process

#### Step 1: Archive Build
1. In Xcode: Product → Archive
2. Wait for build to complete
3. Select "Distribute App"
4. Choose "App Store Connect"

#### Step 2: Upload to App Store Connect
1. Select "Upload"
2. Configure distribution options:
   - ✅ Include bitcode: Yes
   - ✅ Strip Swift symbols: Yes
   - ✅ Upload your app's symbols: Yes

#### Step 3: TestFlight Configuration
1. Go to App Store Connect
2. Select your app
3. Go to TestFlight tab
4. Add build notes:
   ```
   Beta Testing - Dime Time v1.0.0
   
   What to Test:
   - Round-up calculations with sample transactions
   - Debt tracking and goal setting
   - Optional crypto investment flow
   - Overall user experience and interface
   
   Known Issues:
   - Some features are simulated for safety during beta
   - Real financial transactions are disabled
   
   Feedback Focus:
   - User interface and navigation
   - Feature clarity and usefulness
   - Any bugs or crashes encountered
   ```

#### Step 4: Invite Beta Testers
1. Add tester emails (up to 10,000 for external testing)
2. Send invitations
3. Testers receive email with TestFlight link

### 8. Required Screenshots (Sizes)
- **6.7" iPhone**: 1290×2796 pixels
- **6.5" iPhone**: 1242×2688 pixels  
- **5.5" iPhone**: 1242×2208 pixels
- **iPad Pro (6th gen)**: 2048×2732 pixels

### 9. App Store Review Information
```
Demo Account: Not required (no login required for basic features)
Notes: This is a beta version with simulated financial features for testing.
```

### 10. Privacy Information
- ✅ Privacy Policy URL: `https://dimetime.replit.app/privacy-policy.html`
- ✅ Privacy Practices: Financial data collection disclosed

## Troubleshooting Common Issues

### Build Errors
```bash
# Clean Capacitor cache
npx cap clean ios

# Reinstall pods
cd ios/App && pod install

# Rebuild
npm run build && npx cap sync ios
```

### Code Signing Issues
1. Check Apple Developer account status
2. Verify bundle ID is unique and registered
3. Refresh provisioning profiles in Xcode

## Launch Day Checklist
- [ ] Apple Developer account active ($99 paid)
- [ ] App Store Connect app created
- [ ] Xcode project builds successfully
- [ ] All required screenshots captured
- [ ] Beta testing information complete
- [ ] TestFlight invitation emails ready

## Beta Testing Timeline
- **Submit to TestFlight**: Takes 1-24 hours for review
- **Beta Review**: Usually instant for internal testing
- **Tester Invitations**: Can be sent immediately after approval