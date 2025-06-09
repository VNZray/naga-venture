# Naga Venture - File Structure

This document provides an overview of the project's file structure and organization.

## Root Files
- `package.json` - Project dependencies and scripts
- `app.config.js` - Expo app configuration
- `babel.config.js` - Babel transpiler configuration
- `metro.config.js` - Metro bundler configuration
- `webpack.config.js` - Webpack configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `eas.json` - Expo Application Services configuration
- `README.md` - Project documentation

## Main Directories

### `/app/`
Main application screens and layouts organized by app type:
- `_layout.tsx` - Root layout
- `index.tsx` - Main entry point
- `BusinessApp/` - Business-focused application screens
- `TourismApp/` - Tourism management application screens  
- `TouristApp/` - Tourist-facing application screens

### `/components/`
Reusable UI components:
- Form components (ButtonComponent, TextInput, etc.)
- Card components (CardContainer, CardView, etc.)
- Map components (`map/`)
- Shop components (`shops/`)
- Tourist spot components (`touristSpot/`)
- UI utilities (`ui/`)
- Loading skeletons (`skeletons/`)

### `/assets/`
Static assets:
- `fonts/` - Custom fonts (Poppins, SpaceMono)
- `images/` - App icons, logos, and images
- `pins/` - Map pin icons

### `/api/`
API-related files:
- `queryKeys.ts` - API query key definitions

### `/context/`
React Context providers:
- `AccommodationContext.tsx`
- `AuthContext.tsx`
- `EventContext.tsx`
- `TouristSpotContext.tsx`

### `/Controller/`
Data management and business logic:
- `AccommodationData.js`
- `EventData.js`
- `HomeData.js`
- `ReviewData.js`
- `ShopData.js`
- `User.js`

### `/hooks/`
Custom React hooks:
- `useColorScheme.ts`
- `useShops.ts`
- `useThemeColor.ts`

### `/constants/`
App constants and configurations:
- `Colors.ts`
- `ShopColors.ts`

### `/navigation/`
Navigation configuration:
- `ShopNavigator.ts`

### `/services/`
External service integrations:
- `InteractionService.ts`

### `/types/`
TypeScript type definitions:
- `shop.ts`
- `images.d.ts`

### `/utils/`
Utility functions:
- `formatters.ts`

### `/screens/`
Additional screen components

### `/scripts/`
Build and utility scripts:
- `reset-project.js`

### `/docs/`
Project documentation:
- `ComprehensiveStyleGuide.md`
- `PromptRole.md`

## Configuration Files
- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier code formatter configuration
- `.gitignore` - Git ignore patterns
- `declaration.d.ts` - Global TypeScript declarations
- `expo-env.d.ts` - Expo environment types

## Generated/Build Directories
- `.expo/` - Expo build cache
- `node_modules/` - npm dependencies
- `.git/` - Git repository data
- `.vscode/` - VS Code workspace settings

---

*This is a React Native/Expo project with a multi-app architecture supporting Business, Tourism, and Tourist applications.*
