# Android Build Troubleshooting Guide

## Fixed Issues:

✅ **Disabled `newArchEnabled`** - New Architecture was causing build failures
✅ **Removed `reactCompiler`** - React Compiler is experimental and causes issues  
✅ **Added `buildType: "apk"`** - Ensures APK format for preview builds
✅ **Optimized Gradle settings** - Better memory allocation

## If Build Still Fails:

### Option 1: Clean Build (Recommended)
```bash
eas build -p android --profile preview --clear-cache
```

### Option 2: Clear npm/yarn cache
```bash
npm cache clean --force
```

### Option 3: Check Dependencies
```bash
npm install
```

### Option 4: Use Development Profile
```bash
eas build -p android --profile development
```

## Common Build Errors & Solutions

### Error: "Gradle build failed"
**Solution:** 
- Disable experimental features (DONE)
- Clear cache with `--clear-cache` flag

### Error: "Out of memory"
**Solution:** 
- Already configured JVM args: `-Xmx4096m`
- Allocates 4GB to Gradle

### Error: "Module not found"
**Solution:**
```bash
npm install
npm install expo@latest expo-router@latest
```

### Error: "Invalid package name"
**Solution:** Package name is correct: `com.arnab0427.chatify`

## What Changed in This Build:

### app.json
- `newArchEnabled`: false (was true)
- Removed `reactCompiler` from experiments

### eas.json
- Added `buildType: "apk"` for Android
- Added `buildType: "aab"` for production

## Debugging Commands

View full build logs:
```bash
eas build -p android --profile preview --logs
```

Check build status:
```bash
eas build --status
```

## Next Steps

1. ✅ Wait for current build to complete
2. 📱 Test APK on device/emulator
3. 🚀 If successful, celebrate! 🎉
4. 📝 If fails, share full error logs from EAS

## Monitor Build

Check build status at:
https://expo.dev/accounts/arnab0427/projects/chatify/builds
