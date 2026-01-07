# Riwi Jobs Frontend

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Modern web application for job vacancy management and developer applications**

[Live Demo](#production-urls) · [Installation](#installation-and-setup) · [Features](#main-features)

</div>

---

## 👨‍💻 Desarrollador

**Angelica María Cuervo Marín**  
Clan Ubuntu - Riwi  
Ruta Avanzada Backend  
📧 Email: angelica@riwi.io  
📅 Enero 2026

---

## Project Description

**Riwi Jobs Frontend** is a modern web application built with **React**, **TypeScript**, and **Vite** that provides an intuitive interface for job vacancy management. This application consumes the **Riwi Jobs API** and offers different experiences based on user roles (Administrator, Manager, Developer).

### Context

This application was developed as part of the **Advanced Backend Route** project at **Riwi**, implementing modern frontend practices, responsive design, role-based routing, and complete integration with a REST API.

### Target Audience

- **Administrators**: Full dashboard with system statistics and complete user management
- **Managers**: Vacancy creation and management dashboard, application monitoring
- **Developers (Coders)**: Vacancy exploration interface and personal application tracking

---

## Technologies Used

### Core Framework
- **React v18** - JavaScript library for building user interfaces
- **TypeScript v5** - JavaScript superset with static typing
- **Vite v6** - Fast build tool and development server

### Routing and State
- **React Router DOM v7** - Client-side routing
- **React Context API** - Global state management (authentication)

### UI and Styling
- **Tailwind CSS v3** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization and charts

### HTTP Client
- **Axios** - Promise-based HTTP client for API calls

### Production Server
- **Nginx Alpine** - Lightweight web server for production

---

## Project Architecture

The project follows a **modular component-based architecture**:

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Dashboard components by role
│   ├── layout/          # Layout components (Sidebar, Layout)
│   └── ui/              # Shadcn/ui base components
├── contexts/            # React Context providers (Auth)
├── hooks/               # Custom React hooks
├── pages/               # Main application pages
├── services/            # API service layer (axios)
├── types/               # TypeScript type definitions
└── lib/                 # Utilities and helpers
```

### Applied Principles

- **Component Composition**: Reusable and composable components
- **Type Safety**: Full TypeScript implementation
- **Separation of Concerns**: Services layer separate from UI
- **Protected Routes**: Role-based route protection
- **Responsive Design**: Mobile-first approach with Tailwind

---

## Main Features

### 1. Authentication System
- Login with JWT token storage
- Automatic token refresh
- Persistent session with localStorage
- Protected routes by authentication state
- Automatic logout on token expiration

### 2. Role-Based Dashboards
- **Administrator Dashboard**: 
  - General system statistics
  - User and vacancy management
  - Interactive charts with metrics
- **Manager Dashboard**: 
  - Vacancy creation and editing
  - Application monitoring
  - Vacancy statistics
- **Developer Dashboard**: 
  - Active vacancy exploration
  - Quick application process
  - Personal application tracking

### 3. Vacancy Management
- Complete CRUD interface (Admin/Manager)
- Advanced filters: modality, location, company
- Pagination and sorting
- Vacancy detail view
- Available slots indicator

### 4. Application System
- One-click apply to vacancies
- Application status tracking (pending, reviewed, accepted, rejected)
- Visual indicators for application limits
- Real-time validation of business rules

### 5. Responsive Interface
- Mobile-first design
- Collapsible sidebar for small screens
- Adaptive tables and cards
- Touch-friendly interactions

---

## Prerequisites

Before installing the project, make sure you have installed:

| Software | Minimum Version | Download |
|----------|----------------|----------|
| **Docker** | v20.0.0 | [docker.com](https://www.docker.com/get-started) |
| **Docker Compose** | v2.0.0 | (included with Docker Desktop) |
| **Git** | v2.0 | [git-scm.com](https://git-scm.com/downloads) |

> **Backend Required**: This frontend connects to the [Riwi Jobs API](https://github.com/angelicacvo/riwi-jobs).

---

## Installation and Setup

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run the frontend is using Docker Compose.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/angelicacvo/riwi-jobs-frontend.git
cd riwi-jobs-frontend
```

#### Step 2: Configure Environment Variables

Make sure the `.env` file is configured to connect to the backend:

```bash
# Backend API Configuration (Local)
VITE_API_URL=http://localhost:3000
VITE_API_KEY=angelica-secure-api-key-2026
```

> **Important**: VITE variables are embedded at **build time**. If you change them, rebuild the container.

#### Step 3: Build and Start the Frontend

```bash
docker-compose up -d --build
```

This command will:
- Build the React application with Vite
- Create a production-ready Nginx container
- Expose the frontend on port 8080

#### Step 4: Verify the Frontend is Running

```bash
docker ps --filter "name=riwi-jobs-frontend"
```

You should see:
```
NAMES               STATUS                    PORTS
riwi-jobs-frontend  Up X minutes (healthy)    0.0.0.0:8080->8080/tcp
```

#### Step 5: Access the Application

Open your browser at: **http://localhost:8080**

### 📦 Alternative: Local Development (without Docker)

If you prefer to run the project locally without Docker:

#### Prerequisites
- **Node.js** v20.0.0 or higher
- **npm** v9.0.0 or higher

#### Steps

1. **Clone and install dependencies**:
```bash
git clone https://github.com/angelicacvo/riwi-jobs-frontend.git
cd riwi-jobs-frontend
npm install
```

2. **Configure `.env` file** (same as above)

3. **Start development server**:
```bash
npm run dev
```

4. **Access the application**:
- Frontend: http://localhost:5173

---

## 🔗 Full Stack Setup (Backend + Frontend)

To run the complete application locally:

#### Step 1: Start the Backend
```bash
cd riwi-jobs
docker-compose up -d --build
```
Backend will be available at: http://localhost:3000

#### Step 2: Start the Frontend
```bash
cd riwi-jobs-frontend
docker-compose up -d --build
```
Frontend will be available at: http://localhost:8080

#### Step 3: Verify All Services
```bash
docker ps --filter "name=riwi"
```

You should see both containers running:
```
NAMES               STATUS                    PORTS
riwi-jobs-frontend  Up X minutes (healthy)    0.0.0.0:8080->8080/tcp
riwi-jobs-api       Up X minutes (healthy)    0.0.0.0:3000->3000/tcp
```

---

## Test Credentials

Use these credentials to test different roles:

### Users Table

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin Riwi | admin@riwi.io | Admin123! | Administrator |
| Gestor Riwi | gestor@riwi.io | Gestor123! | Manager |
| Coder 1 | coder1@riwi.io | Coder123! | Developer |

### Testing Different Experiences

**Administrator (admin@riwi.io)**
- Dashboard with system statistics
- Full user management (CRUD)
- Complete vacancy and application management
- Interactive charts and metrics

**Manager (gestor@riwi.io)**
- Vacancy creation and editing
- Application status updates
- Vacancy statistics dashboard

**Developer (coder1@riwi.io)**
- Browse available vacancies
- Apply to vacancies (max 3 active)
- Track own application status

---

## Application Structure

### Key Pages

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Index | Public |
| `/login` | LoginPage | Public |
| `/dashboard` | DashboardPage | All authenticated |
| `/explore` | ExplorePage | Coder |
| `/vacancies` | VacanciesPage | Admin/Gestor |
| `/vacancies/:id` | VacancyDetailPage | All authenticated |
| `/applications` | ApplicationsPage | All authenticated |
| `/users` | UsersPage | Admin |
| `/profile` | ProfilePage | All authenticated |

### Protected Routes

The `ProtectedRoute` component handles:
- Authentication verification
- Role-based access control
- Automatic redirection for unauthorized access

Example:
```tsx
<Route path="/users" element={
  <ProtectedRoute allowedRoles={['ADMIN']}>
    <UsersPage />
  </ProtectedRoute>
} />
```

---

## Services Architecture

### API Service Layer

All API calls are centralized in `src/services/`:

```
services/
├── api.ts                  # Axios instance with interceptors
├── authService.ts          # Login, register
├── userService.ts          # User CRUD
├── vacancyService.ts       # Vacancy CRUD
└── applicationService.ts   # Application CRUD and stats
```

### Axios Configuration

The `api.ts` file configures:
- Base URL from environment variables
- API Key header injection
- JWT token injection from localStorage
- Global error handling
- Request/response interceptors

---

## Docker Support

### Production Dockerfile

Multi-stage build optimized for production:

**Stage 1: Build**
- Node.js 20 Alpine
- Install dependencies
- Build Vite application

**Stage 2: Serve**
- Nginx Alpine
- Copy built files to nginx html directory
- Custom nginx configuration for SPA
- Dynamic port support for Railway

### Build and Run Locally

```bash
# Build Docker image
docker build -t riwi-jobs-frontend .

# Run container
docker run -p 8080:8080 riwi-jobs-frontend
```

Access at [http://localhost:8080](http://localhost:8080)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code with ESLint |

---

## Component Library (Shadcn/ui)

This project uses **Shadcn/ui** components:

- **Badge** - Status indicators
- **Button** - Action buttons
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Form** - Form inputs and validation
- **Table** - Data tables
- **Tabs** - Tabbed interfaces
- **Toast** - Notifications

### Adding New Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dropdown-menu
```

---

## Common Troubleshooting

### Error: "Cannot connect to backend"
**Solution**: 
1. Verify backend is running at `http://localhost:3000`
2. Check `VITE_API_URL` in `.env`
3. Verify API Key matches backend configuration

### Error: "401 Unauthorized"
**Solution**: 
1. Token may be expired - login again
2. Verify API Key in `.env` matches backend
3. Check browser console for detailed errors

### Changes to .env not reflected
**Solution**: 
1. VITE variables are embedded at build time
2. Stop dev server (`Ctrl+C`)
3. Restart with `npm run dev`
4. For production: rebuild and redeploy

### Railway deployment shows blank page
**Solution**: 
1. Check `VITE_API_URL` points to correct backend
2. Trigger new deployment after variable changes
3. Check browser console for CORS errors
4. Verify nginx logs in Railway

---

## Author

**Angelica María Cuervo Marín**  
Clan Ubuntu - Riwi  
Advanced Backend Route

---

## Academic Project

This project was developed as part of the training program at **Riwi**, an organization focused on technological education and employability of young people in Colombia.

---

## License

This project is open source and available under the MIT license.

---

<div align="center">

**Developed by Angelica María Cuervo Marín**  
**Riwi - Clan Ubuntu**

</div>
