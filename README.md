# AmkyawDev Website 🌐

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Framework-Three.js-orange?style=flat-square" alt="Three.js">
  <img src="https://img.shields.io/badge/Auth-Firebase-red?style=flat-square" alt="Firebase">
</p>

Professional web development services website with stunning 3D effects, Firebase authentication, interactive chat system, and admin panel.

---

## ✨ Features

### 🎨 UI/UX
- **3D Background** - Floating particles animation (bottom to top)
- **Three.js Effects** - Interactive 3D elements with mouse parallax
- **Smooth Animations** - CSS animations and transitions
- **Modern Design** - Dark theme with purple/blue accents
- **Fully Responsive** - Mobile, tablet, desktop support

### 🔐 Authentication
- **Firebase Auth** - Secure user authentication
- **Login/Register** - Email and password authentication
- **User Dashboard** - Personalized user area
- **Admin Panel** - Full admin access and management

### 💬 Chat System
- **Real-time Chat** - Interactive chat widget
- **Chat History** - Message storage and retrieval
- **Quick Responses** - Pre-defined message templates

### 📊 Admin Features
- **Template Management** - Add, edit, delete templates
- **Project Portfolio** - Manage completed projects
- **User Management** - View and manage users
- **Analytics Dashboard** - Track downloads and views

---

## 📁 Project Structure

```
amkyawdev-website/
├── public/                    # Frontend files
│   ├── index.html            # Homepage with 3D background
│   ├── about.html            # About page
│   ├── dashboard.html        # User dashboard
│   ├── web-template.html     # Template showcase
│   ├── project.html          # Project portfolio
│   ├── contact.html          # Contact form
│   ├── docs.html             # Documentation
│   ├── admin.html            # Admin panel
│   └── assets/
│       ├── css/              # Stylesheets
│       │   ├── main.css
│       │   ├── components.css
│       │   ├── 3d-effects.css
│       │   └── responsive.css
│       ├── js/               # JavaScript files
│       │   ├── main.js
│       │   ├── 3d/           # Three.js effects
│       │   ├── auth/         # Firebase auth
│       │   ├── chat/         # Chat system
│       │   ├── admin/        # Admin functions
│       │   └── utils/        # Utilities
│       └── images/           # Images and assets
│
├── server/                    # Backend API
│   ├── index.js              # Express server
│   ├── api/                  # API routes
│   ├── middleware/           # Auth middleware
│   └── config/               # Firebase admin
│
├── data/                      # JSON data files
│   ├── templates.json        # Web templates
│   ├── projects.json         # Portfolio projects
│   ├── docs.json             # Documentation
│   └── users.json            # User data
│
├── config/                    # Configuration
│   ├── firebase-config.js   # Firebase client
│   └── environment.js        # Environment
│
├── docs/                      # Documentation
│   ├── setup-guide.md
│   ├── api-documentation.md
│   ├── admin-guide.md
│   └── user-guide.md
│
├── package.json
├── package-lock.json
└── firebase.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/amkyawdev/amkyaw-web.git

# Navigate to project directory
cd amkyaw-web

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
npm run deploy
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Framework | Alpine.js |
| 3D Effects | Three.js |
| Backend | Express.js |
| Database | Firebase (Firestore) |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |

---

## 📱 Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage with 3D particles animation |
| `about.html` | About us, skills, timeline |
| `web-template.html` | Template showcase and download |
| `project.html` | Project portfolio gallery |
| `dashboard.html` | User dashboard (requires login) |
| `contact.html` | Contact form |
| `docs.html` | Documentation articles |
| `admin.html` | Admin panel (admin only) |

---

## 🔧 Configuration

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Copy configuration to `config/firebase-config.js`

### Environment Variables
```javascript
// config/environment.js
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 👤 Contact

- Website: [amkyawdev.com](#)
- Email: info@amkyawdev.com
- GitHub: [https://github.com/amkyawdev](https://github.com/amkyawdev)

---

<p align="center">Made with ❤️ by <strong>AmkyawDev</strong></p>