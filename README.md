# EasyTax Support — Digital Tax Filing Support for Small Businesses

> **Tagline:** Simplifying Tax Preparation for Small Businesses  
> **Course / Purpose:** College Community Engagement Project (CEP)  
> **Architecture:** Full Stack MERN (MongoDB, Express, React, Node.js) with Tailwind CSS v4

---

## 📌 Important Tax Disclaimer

> **Academic & Statutory Notice:**  
> **EasyTax Support is an educational and tax-preparation assistance tool.** It does **NOT** replace a Chartered Accountant (CA), tax professional, or official government tax-filing portal (such as [incometax.gov.in](https://www.incometax.gov.in) or [gst.gov.in](https://www.gst.gov.in)). Tax calculations shown by the application are estimates for educational and record-keeping purposes only. The application does **NOT** submit official tax returns to the Indian Government.

---

## 📖 Project Overview

India has over 63 million micro, small, and medium enterprises (MSMEs). Many small retailers, shopkeepers, service providers, and freelancers incur compliance stress and late penalties simply because their daily cash memos, vendor bills, and bank statements are scattered.

**EasyTax Support** bridges this digital literacy divide by providing a straightforward, non-intimidating platform to:
1. Understand foundational tax concepts in plain language.
2. Maintain a single local business profile (no passwords or signup friction).
3. Record and categorize daily business income and expenses.
4. Calculate Estimated Net Income and Taxable Income with educational explanations.
5. Track document readiness (PAN, 12-month bank statements, bills).
6. Follow an interactive 3-stage filing preparation checklist.
7. Explore a searchable glossary of Indian tax terms (GST, ITR, TDS, 44AD, etc.).
8. Print/download a formatted **Tax Preparation Summary** report for a Chartered Accountant.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **No Authentication** | Intentionally designed without login/passwords. Works with a single demo business profile stored in MongoDB. |
| **Dashboard** | 5 live summary cards (Income, Expenses, Net Income, Documents Ready, Filing Progress), Recharts **Income vs Expenses** bar chart, and Category Inflow/Outflow distribution bars. |
| **Income & Expense Tracker** | Full CRUD operations for income and expenses, category filtering, search, date sorting, and **1-click CSV Ledger Export** (`.csv`). |
| **Tax Estimator** | Step-by-step breakdown: `Turnover - Expenses = Net Profit - Deductions = Estimated Taxable Income`. Includes **Section 44AD Presumptive Scheme** comparison (6% digital / 8% cash). |
| **Filing Checklist** | Interactive 17-item checklist across 3 phases (Financial Prep, Document Prep, Final Review) with live progress bar. |
| **Document Readiness Tracker** | Categorized list of statutory, banking, and tax documents with `Available` / `Missing` toggles and custom document additions. |
| **Learn Section** | Beginner-friendly guides on Income Tax, GST, ITR, deductions, invoices, and expense tracking. |
| **Searchable Glossary** | Instant search and category filtering for key Indian tax terms (PAN, GSTIN, ITR, TDS, Turnover, ITC, 44AD, etc.). |
| **FAQ Module** | Clean interactive accordions addressing common small business queries and clearly dispelling filing misconceptions. |
| **Preparation Summary & Print** | One-click modal view and dedicated full-page `/summary` route with `@media print` layout ready for viva evaluation or CA review. |
| **One-Click Demo Reset** | Reset button in the footer to restore clean sample business records anytime during a viva demonstration. |

---

## 🛠️ Technology Stack

### Frontend
- **React 19** (Latest stable version)
- **Vite 8** (Latest stable version)
- **Tailwind CSS v4** (`@tailwindcss/vite` modern CSS-first setup — **No Tailwind v3**)
- **React Router v7** (Declarative client-side routing)
- **Recharts** (Visual responsive chart for financial inflows vs outflows)
- **Axios** (REST API client configured with proxy)
- **Lucide React** (Consistent financial and status icons)

### Backend
- **Node.js** (v24+ compatible)
- **Express 4** (Lightweight REST API framework)
- **MongoDB 8 & Mongoose 8** (Document database with automated schema validation and seeding)
- **CORS & Morgan** (Cross-origin resource sharing & request logging)
- **Dotenv** (Environment variable management)

---

## 📂 Project Structure

```text
EasyTax-Support/
│
├── frontend/                     # React + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Navigation bar with responsive drawer
│   │   │   ├── Footer.jsx        # Footer with disclaimer and demo reset
│   │   │   ├── DisclaimerBanner.jsx # Educational disclaimer alert
│   │   │   ├── ProfileModal.jsx  # Edit Business Profile modal
│   │   │   ├── SummaryModal.jsx  # Printable Preparation Summary modal
│   │   │   └── TransactionModal.jsx # Add/Edit Income & Expense modal
│   │   ├── pages/                # Major application pages
│   │   │   ├── Home.jsx          # Professional landing page
│   │   │   ├── Dashboard.jsx     # Overview, cards & Recharts chart
│   │   │   ├── IncomeExpenses.jsx # Income & Expense CRUD tracker
│   │   │   ├── TaxEstimator.jsx  # Estimated taxable income breakdown
│   │   │   ├── FilingChecklist.jsx # 3-stage interactive checklist
│   │   │   ├── Documents.jsx     # Document readiness tracker
│   │   │   ├── Learn.jsx         # Tax concepts & searchable glossary
│   │   │   └── FAQ.jsx           # Accordion FAQ guide
│   │   ├── services/
│   │   │   └── api.js            # Central Axios API service
│   │   ├── context/
│   │   │   └── BusinessContext.jsx # Global profile & refresh state
│   │   ├── utils/
│   │   │   └── formatters.js     # Currency (₹) and date formatters
│   │   ├── App.jsx               # Route definitions and layout
│   │   ├── main.jsx              # Application bootstrap & router
│   │   └── index.css             # Tailwind CSS v4 (@import "tailwindcss")
│   ├── vite.config.js            # Tailwind v4 plugin + API proxy
│   └── package.json
│
├── backend/                      # Node.js + Express + Mongoose
│   ├── config/
│   │   └── db.js                 # MongoDB connection & auto-seed trigger
│   ├── models/
│   │   ├── Business.js           # Business profile schema
│   │   ├── Transaction.js        # Income / Expense schema
│   │   ├── Checklist.js          # Checklist state schema
│   │   └── DocumentStatus.js     # Document readiness schema
│   ├── controllers/
│   │   ├── businessController.js # Profile get/update/reset logic
│   │   ├── transactionController.js # Transaction CRUD & filter logic
│   │   ├── dashboardController.js # Metrics & monthly aggregate logic
│   │   ├── checklistController.js # Checklist state logic
│   │   └── documentController.js # Document readiness toggle logic
│   ├── routes/                   # Express REST route modules
│   │   ├── businessRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── checklistRoutes.js
│   │   └── documentRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js       # Central error handling
│   ├── utils/
│   │   └── seedData.js           # Realistic initial sample data
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # HTTP listener & DB initiator
│   ├── .env                      # Environment variables
│   ├── .env.example
│   └── package.json
│
├── package.json                  # Root runner scripts
└── README.md                     # Comprehensive documentation
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/easytax_db
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** running locally on port `27017` (or a MongoDB Atlas connection string)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

### Option A: Run Separately in Two Terminals (Recommended)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Backend starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Frontend starts on http://localhost:5173
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

### Option B: Run from Project Root

From the workspace root directory:
```bash
# Start backend server
npm run server

# In another terminal, start frontend
npm run client
```

---

## 🔌 Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status and timestamp |
| `GET` | `/api/business` | Get single business profile (creates demo if absent) |
| `PUT` | `/api/business` | Update business profile details |
| `POST`| `/api/business/reset` | Reset demo database to original state |
| `GET` | `/api/dashboard` | Dashboard metrics, monthly breakdown & recent records |
| `GET` | `/api/transactions` | Query transactions (supports `type`, `category`, `sort`, `search`) |
| `POST`| `/api/transactions` | Create income or expense record |
| `PUT` | `/api/transactions/:id` | Update transaction by ID |
| `DELETE`| `/api/transactions/:id` | Delete transaction by ID |
| `GET` | `/api/transactions/categories` | Get allowed categories for income and expenses |
| `GET` | `/api/checklist` | Get checklist items and completed status |
| `PUT` | `/api/checklist` | Update completed checklist item IDs |
| `GET` | `/api/documents` | Get document readiness items grouped by category |
| `PUT` | `/api/documents` | Toggle document status (`Available` / `Missing`) |
| `POST`| `/api/documents` | Add custom document item to checklist |

---

## 🎓 College CEP Presentation & Viva Guide

When presenting this Community Engagement Project (CEP), consider highlighting these key aspects:

1. **Community Need:**
   - Small shopkeepers often mix personal and business finances and lack formal accounting software due to complexity.
   - EasyTax Support introduces digital bookkeeping habits with zero onboarding friction.

2. **Technical Highlights:**
   - **Tailwind CSS v4:** Built using the newest Tailwind v4 Vite architecture (`@tailwindcss/vite` and `@import "tailwindcss";`), eliminating legacy v3 config files.
   - **Decoupled Architecture:** Clean separation of concerns between Express REST controllers, Mongoose schemas, and React components.
   - **Data Visualizations:** Recharts dynamically plots monthly business income against expenses.
   - **Automated Seeding:** Fresh installs seed a realistic retail store dataset ("Sharma General Store") immediately for a seamless demo.

3. **Responsible AI & Legal Ethics:**
   - Prominent educational disclaimers prevent user confusion regarding official government tax liability.
   - Clear distinction between **Turnover**, **Net Business Income**, and **Taxable Income**.
