# 🚀 Campus Share — Complete Deployment & GitHub Guide

This guide explains the project structure, how to commit the codebase to GitHub, and how to deploy both the **Frontend** (Vercel/Netlify) and **Backend** (Render/Railway/VPS).

---

## 📁 1. Project Directory Structure

```text
CampusShare/
├── .gitignore                    # Master gitignore (protects secrets & node_modules)
├── package.json                  # Root monorepo workspace scripts
├── README.md                     # Project documentation
├── DEPLOYMENT.md                 # Complete GitHub & cloud deployment guide
│
├── client/                       # React 18 + Vite + TailwindCSS Frontend
│   ├── .env                      # Local environment variables (NOT committed)
│   ├── .env.example              # Template environment variables (committed)
│   ├── vercel.json               # SPA routing configuration for Vercel
│   ├── vite.config.js            # Vite configuration & dev proxy
│   ├── tailwind.config.js        # Theme color palettes & styling rules
│   ├── package.json              # Frontend dependencies
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── App.jsx               # Main React Application & Global Modals
│       ├── main.jsx              # Application DOM bootstrap
│       ├── index.css             # Design tokens & dynamic CSS theme engine
│       ├── config/
│       │   └── firebase.js       # Firebase Auth & Cloud Storage SDK
│       ├── components/           # Reusable UI components
│       │   ├── auth/             # GoogleSignInModal, TOTP 2FA Modals
│       │   ├── common/           # Button, Input, Select, Modal, ThemePicker
│       │   ├── landing/          # Hero, CategoryGrid, TrustStats, Testimonials
│       │   ├── payment/          # Cashfree PG Modal, Dynamic UPI QR Scanner
│       │   └── reviews/          # Buyer/Seller 3-Metric Review System
│       ├── pages/                # Routed views
│       │   ├── auth/             # LoginPage, RegisterPage, VerifyEmailPage
│       │   ├── categories/       # CategoryGridPage, CategoryProductsPage
│       │   ├── marketplace/      # ProductDetailsPage, SellItemPage, BrowsePage
│       │   ├── dashboard/        # SellerDashboardPage, MyRentalsPage
│       │   ├── profile/          # ProfilePage (Trust Ratios, Credit Points)
│       │   ├── chat/             # ChatPage (Real-time Socket.io messaging)
│       │   ├── notifications/    # NotificationsPage, AnnouncementsPage
│       │   └── admin/            # AdminLoginPage, AdminDashboardPage
│       ├── redux/                # Redux Toolkit State Management
│       │   ├── store.js          # Central Redux store
│       │   └── slices/           # auth, items, cart, chat, ui slices
│       └── services/             # Axios API client & endpoints
│
└── server/                       # Node.js + Express + MongoDB Backend
    ├── .env                      # Server secrets & DB URIs (NOT committed)
    ├── .env.example              # Server environment template (committed)
    ├── package.json              # Backend dependencies & test scripts
    ├── server.js                 # HTTP + Socket.io Server Entry Point
    ├── app.js                    # Express middleware pipeline & error handling
    ├── config/                   # Configuration modules
    │   ├── db.js                 # MongoDB connection & super admin seed
    │   ├── colleges.js           # Institutional domains registry (Techno India, NIT, IIT)
    │   └── cashfree.js           # Cashfree PG & Easy Split Escrow SDK
    ├── models/                   # Mongoose Database Schemas
    │   ├── User.model.js         # User, Trust Ratio, Credit Points, Payout details
    │   ├── Item.model.js         # Listing, Hourly/Daily rent, Buy, Damage policy
    │   ├── Transaction.model.js  # Escrow, 5% fee, Cashfree splits, Deposit refunds
    │   ├── Review.model.js       # 3-metric Buyer & Seller ratings
    │   ├── College.model.js      # Dynamic College & Domain registry
    │   ├── PlatformSettings.model.js # Platform escrow vendor & 5% fee rate
    │   ├── AdminAuditLog.model.js# Immutable admin audit logs
    │   ├── Category.model.js     # Top-level & custom subcategories
    │   ├── Conversation.model.js # Peer-to-peer chats
    │   ├── Message.model.js      # Chat messages
    │   ├── Notification.model.js # Real-time alerts
    │   ├── Announcement.model.js # Campus-wide broadcasts
    │   └── Report.model.js       # Content moderation reports
    ├── controllers/              # Route controller business logic
    ├── routes/                   # Express REST API endpoints
    ├── middleware/               # Auth, 2FA, Multi-tier Admin & Error guards
    ├── services/                 # Email & Notification dispatchers
    └── socket/                   # Real-time WebSocket messaging handler
```

---

## 🔒 2. Which Files to Push vs. Exclude in GitHub

### ✅ Files to ADD to GitHub (Everything in repository EXCEPT secrets):
- All code files in `client/src/`
- All code files in `server/` (controllers, models, routes, middleware, services, config)
- `client/package.json`, `client/package-lock.json`, `client/vite.config.js`, `client/tailwind.config.js`
- `client/vercel.json`, `client/index.html`
- `server/package.json`, `server/package-lock.json`, `server/server.js`, `server/app.js`
- **Configuration Templates**: `client/.env.example`, `server/.env.example`
- Root files: `package.json`, `README.md`, `DEPLOYMENT.md`, `.gitignore`

### 🚫 Files to NEVER push to GitHub (Protected by `.gitignore`):
- `client/.env` *(Contains your live Firebase API keys)*
- `server/.env` *(Contains JWT secrets, MongoDB strings, payment credentials)*
- `client/node_modules/` & `server/node_modules/` *(Installed via `npm install`)*
- `client/dist/` *(Generated during `npm run build`)*

---

## 🛠️ 3. How to Push Code to GitHub

Open your terminal in `C:\Users\Ahana Ghosh\.gemini\antigravity-ide\scratch\CampusShare`:

```bash
# 1. Initialize Git repository
git init

# 2. Stage all files (the master .gitignore automatically ignores .env and node_modules)
git add .

# 3. Commit your changes
git commit -m "feat: complete Campus Share production marketplace with Firebase, Cashfree & Techno India University"

# 4. Link your remote GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/CampusShare.git

# 5. Set main branch and push
git branch -M main
git push -u origin main
```

---

## ☁️ 4. Cloud Deployment Instructions

### 🅰️ Deploy Frontend on **Vercel** (Recommended):
1. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
2. Import your **`CampusShare`** GitHub repository.
3. In Project Settings:
   - **Root Directory**: Select `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables** in the Vercel Dashboard:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api/v1`
   - `VITE_FIREBASE_API_KEY`: `AIzaSyBtlQl1CiIUm4qt7l_F_lNCW26JbYg-Bh0`
   - `VITE_FIREBASE_AUTH_DOMAIN`: `campus-share-d9e72.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: `campus-share-d9e72`
   - `VITE_FIREBASE_STORAGE_BUCKET`: `campus-share-d9e72.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: `696860951539`
   - `VITE_FIREBASE_APP_ID`: `1:696860951539:web:1ec72cffd97fb659540886`
   - `VITE_FIREBASE_MEASUREMENT_ID`: `G-PZPEQM2FGQ`
5. Click **Deploy**.

---

### 🅱️ Deploy Backend on **Render** (Recommended):
1. Go to [Render](https://render.com/) and click **"New Web Service"**.
2. Connect your **`CampusShare`** GitHub repository.
3. Configure the service:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (runs `node server.js`)
4. Add **Environment Variables** in the Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/campus_share`
   - `JWT_SECRET`: *(Generate a secure 32+ character string)*
   - `COOKIE_SECRET`: *(Generate a secure string)*
5. Click **Create Web Service**.

---

### 🔥 5. Whitelist Production Domain in Firebase Console
Once your frontend is deployed on Vercel (e.g. `https://campus-share.vercel.app`):
1. Open [Firebase Console](https://console.firebase.google.com/) → Select `campus-share-d9e72`.
2. Go to **Authentication** → **Settings** → **Authorized domains**.
3. Click **Add domain** and enter your Vercel domain (e.g. `campus-share.vercel.app`).
