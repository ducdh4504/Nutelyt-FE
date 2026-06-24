# Nutelyt FE

Nutelyt is a nutrition mobile app frontend built with Expo and React Native. This repository is set up as a clean foundation for future product screens and Figma-to-code work.

## Project stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- NativeWind v4 with Tailwind CSS
- shadcn-style React Native component patterns inspired by React Native Reusables

## Install

```bash
npm install
```

## Run

```bash
npm run start
```

You can open the app with Expo Go from the Expo CLI options.

## Folder structure

- `app/`: Expo Router routes and layouts. Keep route files thin and delegate screen UI to `src/features`.
- `src/components/ui/`: reusable UI primitives such as `Button`, `Input`, `Card`, and `Typography`.
- `src/components/layout/`: layout helpers such as `ScreenContainer`.
- `src/constants/`: Nutelyt design tokens for colors, spacing, and rounded card styles.
- `src/lib/`: small shared utilities.
- `src/types/`: shared TypeScript types.
- `src/features/auth/`: authentication screen placeholders.
- `src/features/onboarding/`: onboarding and welcome screen placeholders.
- `src/features/home/`: home dashboard placeholders.
- `components/`, `constants/`, and `hooks/`: existing Expo starter helpers kept for compatibility while the app transitions into the `src/` structure.

## NativeWind

NativeWind is configured with:

- `tailwind.config.js`
- `babel.config.js`
- `metro.config.js`
- `global.css`
- `nativewind-env.d.ts`

The global stylesheet is imported from `app/_layout.tsx`, which keeps styling available through the Expo Router entry.

## Figma note

Figma integration is intentionally not connected yet. The current screens are placeholders so the real Nutelyt UI can be added later from Figma without reshaping the project foundation.
