# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Digital Journal App

A full-stack digital journaling application built with React and Firebase featuring a galaxy-themed UI.

## Features
- Write daily journal entries with mood tracking
- Grammar checker powered by LanguageTool API
- Sentiment analysis on each entry
- Photo attachments via Firebase Storage
- LeetCode-style activity streak grid
- Mood trend chart over 7 or 30 days
- Search entries by keyword with highlight
- Dark and light mode toggle
- Smooth page transitions with Framer Motion
- Fully responsive — sidebar on desktop, bottom tab on mobile
- Galaxy animated background with glassmorphism cards

## Tech Stack
- React 18 with Vite
- Firebase Realtime Database + Storage
- React Router v6
- Framer Motion
- Recharts
- LanguageTool API

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env` file with your Firebase config
4. Run `npm run dev`

## Environment Variables
```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_DATABASE_URL=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
```