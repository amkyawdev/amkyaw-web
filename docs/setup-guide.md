# AmkyawDev Setup Guide

## Prerequisites

- Node.js 14.0 or higher
- npm or yarn
- Firebase account (for deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/amkyawdev/amkyawdev-website.git
cd amkyawdev-website
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Project Structure

```
amkyawdev-website/
├── public/           # Static files
│   ├── assets/       # CSS, JS, images
│   └── *.html       # HTML pages
├── server/           # Backend API
├── data/             # JSON data files
├── config/           # Configuration files
└── docs/             # Documentation
```

## Customization

### Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Add your config to `config/firebase-config.js`
3. Update the credentials in `server/config/firebase.admin.js`

### Templates

Edit `data/templates.json` to add or modify templates.

### Projects

Edit `data/projects.json` to add or modify projects.

## Deployment

Deploy to Firebase Hosting:
```bash
npm run deploy
```

## Features

- 📱 Responsive design
- 🎨 Modern UI/UX
- ✨ 3D effects with Three.js
- 🔐 Firebase authentication
- 💬 Chat widget
- 📊 Admin panel