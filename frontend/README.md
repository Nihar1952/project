# Secure File Storage – Frontend

React frontend for the secure file storage backend. Built with Vite, React, and TailwindCSS.

## Features

- **Authentication**: Register, login, logout with JWT
- **File upload**: Upload files with optional recipients, ML-based sensitivity classification
- **File download**: Download with password-based decryption
- **Audit trail**: View blockchain audit logs per file
- **Responsive UI**: Modern dark theme with sidebar navigation

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:3000`

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is in the `dist/` directory. Preview with:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable UI components
│   ├── context/       # Auth and file state
│   ├── pages/         # Route pages
│   ├── utils/         # Helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Pages

| Route       | Description                        |
|------------|------------------------------------|
| `/login`   | Sign in                            |
| `/register`| Create account                     |
| `/dashboard`| Overview, upload, recent files    |
| `/upload`  | Upload file form                   |
| `/files`   | My uploaded files                  |
| `/audit`   | Select file for audit              |
| `/audit/:fileId` | Blockchain audit for a file  |

## API Configuration

The API base URL is set to `http://localhost:3000` in `src/api/client.js`. Change it if your backend runs elsewhere.

JWT is stored in `localStorage` and sent as `Authorization: Bearer <token>` on all authenticated requests.
