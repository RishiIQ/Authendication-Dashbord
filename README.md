# Auth Dashboard

A modern, secure authentication dashboard built with React 19, Vite, Tailwind CSS, and React Router.

## Features

- **Authentication Flow**: Login, Register, Forgot Password, Reset Password
- **Dashboard**: Protected routes with sidebar navigation (Profile, Settings)
- **Theme Support**: Light/dark mode toggle with persistent preference
- **Password Security**: Strength meter, validation, and complexity rules
- **Toast Notifications**: Success, error, and info messages
- **Responsive Design**: Mobile-first layout with Tailwind CSS
- **Routing**: Proper URL-based navigation with React Router v7
- **State Management**: Centralized auth context with localStorage persistence

## Tech Stack

- **React 19** — UI library with JSX transform
- **Vite 8** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first CSS framework
- **React Router v7** — Client-side routing
- **Lucide React** — Icon library
- **Oxlint** — Lightning-fast linter

## Project Structure

```
src/
├── App.jsx                        # Root app with React Router setup
├── main.jsx                       # React entry point
├── index.css                      # Tailwind directives + custom styles
├── assets/                        # Static images
├── components/
│   ├── ui/                        # Reusable UI (Toast, InputField, Button, PasswordStrength)
│   └── layout/                    # Layout components (DashboardLayout, Sidebar, Header)
├── context/
│   └── AuthContext.jsx            # Auth context + provider with localStorage
├── hooks/
│   ├── useAuth.js                 # Auth context hook
│   └── useLocalStorage.js         # Local storage persistence hook
├── screens/
│   ├── auth/                      # Auth screens (Login, Register, Forgot, Reset)
│   ├── ProfileScreen.jsx          # User profile editor
│   └── SettingsScreen.jsx         # Password change form
└── utils/
    └── validators.js              # Email & password validation utilities
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Fix lint issues
npm run lint:fix
```

## Demo Credentials

- **Email**: `demo@example.com`
- **Password**: `Password@123`

## Enhancements Made

- [x] Replaced Tailwind CDN with proper Tailwind CSS v4 build
- [x] Added React Router v7 for proper URL-based routing
- [x] Split monolithic 786-line App.jsx into modular components
- [x] Added theme persistence (saved to localStorage)
- [x] Added dark mode toggle button in header
- [x] Fixed infinite toast bounce animation (one-time entrance)
- [x] Added password strength meter with visual indicators
- [x] Improved password reset flow with token generation & validation
- [x] Added ProtectedRoute and AuthRoute wrappers
- [x] Removed unused/dead components
- [x] Enhanced Settings screen with password validation
- [x] Removed unnecessary React imports (React 19 JSX transform)
- [x] Added comprehensive code comments
