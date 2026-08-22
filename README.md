# 🎓 Campus Share — College-Exclusive Student Marketplace

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

**Campus Share** is a production-quality, full-stack college-exclusive marketplace built specifically for students. It provides a secure, verified campus ecosystem where students can safely buy, sell, negotiate, and exchange second-hand textbooks, scientific calculators, laptops, bicycles, hostel essentials, lab equipment, and sports gear exclusively within their university community.

---

## ✨ Key Features & Capabilities

- 🔐 **Institutional Domain Verification**: Automatic validation of official college emails (`.edu`, `.ac.in`, `@nitdelhi.ac.in`, `@iitd.ac.in`, etc.) with crypto tokens and HTTP-Only session cookies.
- 📦 **13 Product Categories**: Categorized catalog tailored for campus life (Textbooks, Calculators, Electronics, Bicycles, Lab Equipment, Hostel Furniture, Cooking Essentials, Musical Instruments, etc.).
- 🔍 **Real-Time Search & Filtering**: Multi-condition query engine with text search, price slider, condition badges, department/semester selectors, and instant sorting.
- 📱 **Listing QR Pass Generator**: Every item features an auto-generated client & server-side dynamic QR code for instant smartphone camera scanning and on-campus offline handoffs.
- 💬 **Live Socket.io Chat & Negotiation**: Real-time peer-to-peer messaging with conversation rooms, live typing indicators, online presence tracking, unread badges, and 1-tap quick campus reply chips.
- 🤝 **Offline Campus Exchanges & Transactions**: Safe physical handoffs with zero transaction fees, agreed price logging, and payment recording (UPI / Direct Cash).
- ⭐ **Seller Reputation & Trust Badges**: 1-to-5 star rating engine recalculating composite trust scores and unlocking badges (*Top Seller*, *Punctual Meetup*, *Accurate Description*, *Fast Responder*).
- 📊 **Seller Analytics Dashboard**: Metrics center tracking gross sales volume (₹), active inventory, items sold, recent transactions ledger, and review management.
- 🔔 **In-App Notification Center & Price Drop Alerts**: Header notification drawer with animated pulse counter and automated notifications triggered whenever a seller discounts an item.
- 🛡️ **Comprehensive Admin Panel & Moderation**: 5-tab admin control center for user ban/unban, manual student verification, item status moderation, safety report resolution, and college domain additions.
- 🔒 **Enterprise Security Hardening**: NoSQL injection protection, recursive XSS script sanitization, tiered rate limiters, and Helmet CSP policies.

---

## 🏗️ Architecture & Technology Stack

```
CampusShare/
├── client/                     # Frontend Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI & Common Components
│   │   ├── context/            # Theme & Context Providers
│   │   ├── layouts/            # Root & Header Layouts
│   │   ├── pages/              # 12 Functional Phase Pages
│   │   │   ├── auth/           # Login, Register, Verify, Forgot, Reset
│   │   │   ├── marketplace/    # Browse, Item Details, Sell Wizard, Wishlist
│   │   │   ├── chat/           # Split-View Real-Time Chat Room
│   │   │   ├── dashboard/      # Seller Metrics & Listings Manager
│   │   │   ├── admin/          # 5-Tab Admin Control Center
│   │   │   ├── notifications/  # In-App Notification Hub
│   │   │   └── profile/        # Tabbed Student Profile & Password Manager
│   │   ├── redux/              # Redux Toolkit Slices & Central Store
│   │   ├── routes/             # AppRoutes & ProtectedRoute Guards
│   │   └── services/           # Axios HTTP Interceptors & Socket.io Singleton
├── server/                     # Backend API & WebSocket Server (Node.js + Express)
│   ├── config/                 # DB Connection & University Registry
│   ├── controllers/            # REST API Handlers
│   ├── middleware/             # Auth, Security, Rate Limiter & Error Handlers
│   ├── models/                 # Mongoose Schemas (User, Item, Chat, Review, etc.)
│   ├── routes/                 # Express API Routers
│   ├── scripts/                # Master Database Seed Script
│   ├── socket/                 # Socket.io Lifecycle & Event Handlers
│   └── test_all_phases.js      # Unified Master E2E Automated Test Runner
```

---

## 📡 REST API Reference

| Module | Method | Endpoint | Access | Description |
|---|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | Public | System status and memory diagnostic |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Student registration with college domain check |
| | `POST` | `/api/v1/auth/verify-email` | Public | Verify student token and issue auth cookie |
| | `POST` | `/api/v1/auth/login` | Public | Authenticate verified student |
| | `GET` | `/api/v1/auth/me` | Protected | Fetch current session student profile |
| | `POST` | `/api/v1/auth/logout` | Protected | Clear session cookie |
| | `POST` | `/api/v1/auth/forgot-password` | Public | Dispatch password recovery link |
| | `POST` | `/api/v1/auth/reset-password` | Public | Reset password with token |
| **Users** | `GET` | `/api/v1/users/profile` | Protected | Get detailed student profile |
| | `PUT` | `/api/v1/users/profile` | Protected | Update bio, phone, department, semester |
| | `PUT` | `/api/v1/users/change-password` | Protected | Update account password |
| **Items** | `GET` | `/api/v1/items` | Public | Search, filter, sort & paginate listings |
| | `GET` | `/api/v1/items/:id` | Public | Product details & QR pass generation |
| | `POST` | `/api/v1/items` | Protected | Multi-step sell wizard listing creation |
| | `PUT` | `/api/v1/items/:id` | Protected | Update listing (triggers price drop alerts) |
| | `DELETE` | `/api/v1/items/:id` | Protected | Delete listing |
| **Wishlist** | `GET` | `/api/v1/wishlist` | Protected | Get saved items |
| | `POST` | `/api/v1/wishlist/toggle` | Protected | Add / Remove item from wishlist |
| | `GET` | `/api/v1/wishlist/ids` | Protected | Quick ID synchronization array |
| **Chat** | `GET` | `/api/v1/chat/conversations` | Protected | Get student's active conversation threads |
| | `POST` | `/api/v1/chat/conversations` | Protected | Create or retrieve item conversation |
| | `GET` | `/api/v1/chat/messages/:id` | Protected | Get message stream (auto marks as read) |
| | `POST` | `/api/v1/chat/messages` | Protected | Send message (broadcasts Socket event) |
| | `GET` | `/api/v1/chat/unread-count` | Protected | Live unread messages count |
| **Transactions** | `POST` | `/api/v1/transactions/mark-sold` | Protected | Record offline exchange & mark item sold |
| | `GET` | `/api/v1/transactions/seller-dashboard` | Protected | Aggregated earnings and sales metrics |
| **Reviews** | `POST` | `/api/v1/reviews` | Protected | Submit 5-star review and trust badges |
| | `GET` | `/api/v1/reviews/seller/:id` | Public | Fetch verified reviews for a seller |
| **Admin** | `GET` | `/api/v1/admin/overview` | Admin | Platform overview metrics & category stats |
| | `GET` | `/api/v1/admin/users` | Admin | Search, filter & paginate users |
| | `PUT` | `/api/v1/admin/users/:id/ban` | Admin | Toggle Ban/Unban user account |
| | `PUT` | `/api/v1/admin/users/:id/verify` | Admin | Manually verify student account |
| | `GET` | `/api/v1/admin/items` | Admin | Moderate listing queue |
| | `PUT` | `/api/v1/admin/items/:id/status` | Admin | Approve or reject listing |
| | `GET` | `/api/v1/admin/reports` | Admin | View safety reports |
| | `POST` | `/api/v1/admin/reports/:id/resolve` | Admin | Resolve report with action |
| | `POST` | `/api/v1/admin/colleges` | Admin | Register new approved college & domain |
| **Notifications**| `GET` | `/api/v1/notifications` | Protected | Fetch user in-app notifications |
| | `PUT` | `/api/v1/notifications/:id/read` | Protected | Mark notification as read |
| | `PUT` | `/api/v1/notifications/read-all` | Protected | Mark all notifications as read |
| **Announcements**| `GET` | `/api/v1/announcements` | Public | Active campus broadcast banners |

---

## ⚡ Socket.io Real-Time Event Catalog

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `join_conversation` | Client → Server | `{ conversationId }` | Join room `conversation_<id>` |
| `leave_conversation` | Client → Server | `{ conversationId }` | Leave conversation room |
| `typing_start` | Client → Server | `{ conversationId, userName }` | Broadcasts typing indicator to peers |
| `typing_stop` | Client → Server | `{ conversationId }` | Clears typing indicator |
| `send_message` | Client → Server | `{ conversationId, text, receiverId }` | Dispatches real-time message |
| `message_received` | Server → Client | `{ message }` | Delivered live to conversation room |
| `message_notification`| Server → Client | `{ message, conversationId }` | Direct alert to receiver's private room |

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI (Falls back automatically to zero-config in-memory database in development)

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds realistic campus students, admin, and items
npm run dev      # Starts API & Socket.io server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### 4. Running Master Test Suite
```bash
cd server
npm test         # Executes all 9 test suites sequentially
```

---

## 🔑 Default Credentials (After Seeding)

| Role | College Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `admin@nitdelhi.ac.in` | `password123` | Full Admin Panel & Moderation |
| **Student Seller** | `aarav.sharma@nitdelhi.ac.in` | `password123` | Seller Dashboard & Marketplace |
| **Student Buyer** | `ananya.roy@nitdelhi.ac.in` | `password123` | Wishlist & Peer Messaging |

---

## 🌐 Production Deployment Architecture

### 1. Frontend (Vercel / Netlify)
- Set build command: `npm run build`
- Output directory: `dist`
- Environment Variables:
  ```env
  VITE_API_URL=https://your-api-domain.com/api/v1
  VITE_SOCKET_URL=https://your-api-domain.com
  ```

### 2. Backend (Render / Railway / DigitalOcean / AWS ECS)
- Set start command: `node server.js`
- Environment Variables:
  ```env
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/campus_share?retryWrites=true&w=majority
  CLIENT_URL=https://your-frontend-domain.com
  JWT_SECRET=your_super_secret_production_jwt_key
  JWT_EXPIRES_IN=7d
  COOKIE_SECRET=your_secure_cookie_signing_secret
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=586
  SMTP_USER=apikey
  SMTP_PASS=your_sendgrid_api_key
  EMAIL_FROM=Campus Share <noreply@campusshare.edu>
  ```

---

## 📄 License
This project is licensed under the **ISC License**. Built with excellence for students everywhere.
