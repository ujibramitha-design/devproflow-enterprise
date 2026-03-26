# Implementation/Mobile — Platform A

**Strategy:** Reference Design + Native Implementation  
**UI Library:** React Native Paper  
**Source Design:** 05_UI_Design_System/Implementation/Web/ (reference only)

---

## ⚠️ IMPORTANT: Do NOT Copy Web Components Directly

Web components (`div`, `button`, CSS) are incompatible with React Native.  
Use this folder as a placeholder — actual code lives in `01_Mobile_APK_Android/`.

---

## How to Use

1. **Visual Reference:** Look at `Implementation/Web/components/ui/` for design patterns
2. **Token Import:** Use `01_Mobile_APK_Android/src/theme/tokens.ts`
3. **Implement:** Recreate using React Native Paper components
4. **Validate:** Colors/spacing/typography must match Design_Tokens.json

---

## Token Path

```typescript
import tokens from '../../Shared/Design_Tokens.json';
```

## Component Library

```bash
npm install react-native-paper react-native-vector-icons
npm install @react-navigation/native @react-navigation/drawer
```

---

**Code Location:** `01_Mobile_APK_Android/src/`  
**Guide:** `01_Mobile_APK_Android/MOBILE_IMPLEMENTATION_GUIDE.md`  
**Token Reference:** `Shared/Design_Tokens.json`
