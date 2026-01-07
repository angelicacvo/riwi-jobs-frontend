# Riwi Jobs Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Modern web application for job vacancy management and applications.

**Developer:** Angelica Maria Cuervo Marin  
**Riwi - Clan Ubuntu**  
Email: angelica@riwi.io  
Date: January 2026

---

## Description

Modern web interface consuming the **Riwi Jobs API**, offering personalized experiences by user role (Admin, Manager, Developer).

**Features by role:**
- **Admin:** Full dashboard with statistics, user management, all vacancies/applications
- **Manager:** Vacancy metrics dashboard, create/manage vacancies, monitor applications
- **Coder:** Browse vacancies with filters, apply (max 3), track personal applications

---

## Production URL

**https://riwi-jobs-frontend.up.railway.app**

---

## Technologies

- **React v18** + **TypeScript v5** - Modern typed UI
- **Vite v6** - Ultra-fast build tool
- **React Router DOM v7** - Role-based routing
- **Tailwind CSS v3** - Responsive utility-first design
- **Shadcn/ui** - High-quality UI components
- **Recharts** - Interactive charts
- **Axios** - HTTP client
- **Lucide React** - Modern icons
- **Nginx Alpine** - Production web server

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboards by role (Admin, Manager, Coder)
│   ├── layout/          # Main layout with Sidebar
│   └── ui/              # Shadcn/ui base components
├── contexts/            # AuthContext for global state
├── hooks/               # Custom hooks (mobile, toast)
├── pages/               # Main application pages
├── services/            # API service layer (axios)
├── types/               # TypeScript definitions
└── lib/                 # Utilities and helpers
```

---

## Features

**Authentication & Security:**
- JWT login, user registration, role-based route protection, session persistence

**User Interface:**
- Responsive mobile-first design, dark theme, reusable components, smooth animations

**Dashboards:**
- **Admin:** Stats cards, popular vacancies chart, recent activity
- **Manager:** Vacancy stats, popular and recent vacancy charts
- **Coder:** Browse vacancies, application counter, personal applications

**Vacancy Management:**
- List with filters (search, modality, location), create/edit form, active/inactive toggle

**Application Management:**
- Personalized view by role, 3 application limit (Coder), visual states, filters

---

## Installation

**With Docker (Recommended):**
```bash
git clone https://github.com/angelicacvo/riwi-jobs-frontend.git
cd riwi-jobs-frontend
docker-compose up -d --build
# Access http://localhost:8080
```

**Without Docker:**
```bash
npm install
npm run dev
# Access http://localhost:5173
```

---

## Test Users

| Email | Password | Role |
|-------|----------|------|
| angelica@riwi.com | Admin123! | Admin |
| gestor@riwi.com | Gestor123! | Manager |
| juan@riwi.com | Coder123! | Coder |

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview build |
| `npm run lint` | Run ESLint |

---

## Configuration

**Environment Variables:**
```env
VITE_API_URL=https://riwi-jobs-production.up.railway.app
```

**Ports:**
- Development: 5173 (Vite dev server)
- Production (Docker): 8080 (Nginx)
- Preview: 4173

---

## Troubleshooting

**Port 8080 busy:** Change port in `docker-compose.yml`  
**API not responding:** Verify backend is running, check `VITE_API_URL` in `.env`  
**Build errors:** Clear cache with `rm -rf node_modules dist && npm install && npm run build`

---

## License

Academic project for Riwi - MIT License

---

**Developed by Angelica Maria Cuervo Marin**  
**Riwi - Clan Ubuntu - Advanced Backend Track**
npm run build

# 4. Preview del build
npm run preview
```

---

## 🔑 Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| angelica@riwi.com | Admin123! | ADMIN |
| gestor@riwi.com | Gestor123! | GESTOR |
| juan@riwi.com | Coder123! | CODER |

---

## 🎯 Flujo de Usuario

### Como Administrador:
1. Login → Dashboard con estadísticas completas
2. Gestionar Usuarios → CRUD completo
3. Ver Vacantes → Todas las vacantes del sistema
4. Ver Postulaciones → Todas las postulaciones

### Como Gestor:
1. Login → Dashboard con métricas de vacantes
2. Crear Vacante → Formulario completo
3. Gestionar Vacantes → Editar/desactivar propias
4. Ver Postulaciones → Consultar estado

### Como Coder:
1. Login → Dashboard personal
2. Explorar → Buscar vacantes con filtros
3. Postularse → Máximo 3 activas
4. Mis Postulaciones → Ver estado

---

## 📊 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor desarrollo (puerto 5173) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Linter ESLint |

---

## 🔧 Configuración

### Variables de Entorno

```env
# .env
VITE_API_URL=https://riwi-jobs-production.up.railway.app
```

### Ports

- **Desarrollo:** 5173 (Vite dev server)
- **Producción (Docker):** 8080 (Nginx)
- **Preview:** 4173

---

## 🎨 Componentes Principales

### Layout
- **Sidebar:** Navegación responsive con items según rol
- **Layout:** Wrapper principal con sidebar y contenido

### Dashboard
- **AdminDashboard:** Stats + gráfico de vacantes populares + actividad
- **GestorDashboard:** Stats + gráfico popular + vacantes recientes
- **CoderDashboard:** Explorar vacantes + mis postulaciones

### Pages
- **LoginPage:** Autenticación con validación
- **ExplorePage:** Catálogo de vacantes con filtros
- **VacanciesPage:** CRUD de vacantes (Admin/Gestor)
- **ApplicationsPage:** Gestión de postulaciones
- **UsersPage:** CRUD usuarios (Admin only)

---

## 🐛 Troubleshooting

**Puerto 8080 en uso:**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8081:8080"
```

**API no responde:**
- Verificar que backend esté corriendo
- Revisar VITE_API_URL en .env

**Build errors:**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

---

## 📄 Licencia

MIT License - Proyecto académico para Riwi

---

<div align="center">

**Desarrollado con ❤️ por Angelica María Cuervo Marín**  
**Riwi - Clan Ubuntu - Ruta Avanzada Backend**

</div>
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
