# Riwi Jobs - Frontend

Plataforma web para la gestión de vacantes laborales de Riwi. Sistema completo con autenticación JWT y control de roles (ADMIN, GESTOR, CODER).

## 🚀 Características

- **Autenticación JWT** con login y registro
- **Control de roles** (ADMIN, GESTOR, CODER)
- **Gestión de usuarios** (CRUD completo)
- **Gestión de vacantes** (CRUD, activar/desactivar)
- **Sistema de postulaciones** (máximo 3 activas por coder)
- **Dashboard dinámico** según rol del usuario
- **Métricas y estadísticas** con gráficos interactivos
- **Filtros y búsqueda** en vacantes y postulaciones
- **Interfaz responsive** con diseño moderno

## 🛠️ Tecnologías

- **React 18** + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **Shadcn/ui** - Componentes UI
- **Axios** - Peticiones HTTP con promesas
- **React Router v6** - Navegación
- **React Hook Form + Zod** - Validación de formularios
- **SweetAlert2** - Alertas y confirmaciones
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## ⚙️ Configuración

La aplicación se conecta por defecto a:
- **API Base URL**: `http://localhost:3000`
- **API Key**: `riwi-2024-secret-key-pro`

Asegúrate de que el backend NestJS esté corriendo antes de iniciar el frontend.

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # Layout, Sidebar, Navigation
│   ├── dashboard/       # Dashboards por rol
│   ├── ui/              # Componentes UI (shadcn)
│   └── ProtectedRoute   # Protección de rutas por rol
├── contexts/
│   └── AuthContext      # Manejo de autenticación
├── services/
│   ├── api.ts           # Configuración Axios + Interceptores
│   ├── authService      # Login, registro
│   ├── userService      # CRUD usuarios
│   ├── vacancyService   # CRUD vacantes
│   └── applicationService # CRUD postulaciones
├── pages/
│   ├── LoginPage        # Login/Registro
│   ├── DashboardPage    # Dashboard principal
│   ├── UsersPage        # Gestión usuarios (ADMIN)
│   ├── VacanciesPage    # Gestión vacantes (ADMIN/GESTOR)
│   ├── ExplorePage      # Ver vacantes (CODER)
│   ├── ApplicationsPage # Postulaciones
│   ├── ProfilePage      # Perfil de usuario
│   └── MetricsPage      # Métricas y estadísticas
└── types/
    └── index.ts         # Interfaces TypeScript
```

## 👥 Roles y Permisos

### ADMIN
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión completa de vacantes (CRUD)
- ✅ Ver todas las postulaciones
- ✅ Eliminar usuarios y vacantes
- ✅ Acceso a todas las métricas

### GESTOR
- ✅ Crear, editar y activar/desactivar vacantes
- ✅ Ver todas las postulaciones
- ✅ Ver métricas y estadísticas
- ❌ No puede eliminar vacantes ni usuarios

### CODER
- ✅ Ver vacantes activas
- ✅ Postularse a vacantes (máximo 3 activas)
- ✅ Ver sus propias postulaciones
- ✅ Editar su propio perfil
- ❌ No puede crear vacantes ni ver otras postulaciones

## 🔐 Autenticación

El sistema usa JWT almacenado en `localStorage`:
- **Token**: `localStorage.getItem('token')`
- **Usuario**: `localStorage.getItem('user')`

Los headers se envían automáticamente en cada petición:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'riwi-2024-secret-key-pro',
  'Authorization': 'Bearer {JWT_TOKEN}'
}
```

## 🎨 Características de UI/UX

- ✅ Diseño responsive (mobile first)
- ✅ Sidebar colapsable con navegación por rol
- ✅ Animaciones suaves y transiciones
- ✅ Loading states y empty states
- ✅ Validación en tiempo real de formularios
- ✅ Confirmaciones con SweetAlert2
- ✅ Badges de estado y cupos disponibles
- ✅ Gráficos interactivos (pie chart, bar chart)
- ✅ Filtros dinámicos y búsqueda
- ✅ Protección de rutas por rol

## 🔄 Flujo de Usuario

### CODER
1. Login/Registro
2. Dashboard → Ve contador de postulaciones (X/3)
3. Explorar Vacantes → Filtrar y buscar
4. Ver detalles de vacante
5. Postularse (validaciones automáticas)
6. Ver mis postulaciones

### GESTOR
1. Login
2. Dashboard → Estadísticas de vacantes
3. Crear/Editar vacantes
4. Activar/Desactivar vacantes
5. Ver postulaciones recibidas
6. Ver métricas

### ADMIN
1. Login
2. Dashboard → Estadísticas completas
3. Gestionar usuarios (CRUD)
4. Gestionar vacantes (CRUD completo)
5. Ver todas las postulaciones
6. Eliminar registros

## ✅ HU-10: Frontend Básico (Cumplida)

Esta aplicación cumple completamente con la Historia de Usuario HU-10:

- ✅ **Estructura HTML/CSS básica** - React con TailwindCSS
- ✅ **Página de login/registro** - [LoginPage.tsx](src/pages/LoginPage.tsx)
- ✅ **Página para listar vacantes** - [VacanciesPage.tsx](src/pages/VacanciesPage.tsx) y [ExplorePage.tsx](src/pages/ExplorePage.tsx)
- ✅ **Página para postularse** - [VacancyDetailPage.tsx](src/pages/VacancyDetailPage.tsx)
- ✅ **Usar fetch/axios con promesas** - [api.ts](src/services/api.ts) con Axios
- ✅ **Manejar JWT en localStorage** - [AuthContext.tsx](src/contexts/AuthContext.tsx)
- ✅ **Agregar headers (Authorization + x-api-key)** - [api.ts](src/services/api.ts#L10-L15)

## 🧪 Validaciones Implementadas

### Frontend
- Email válido y requerido
- Contraseña mínima de 6 caracteres
- Nombre mínimo de 2 caracteres
- Validación de formularios con Zod
- Prevención de postulación duplicada
- Límite de 3 postulaciones activas
- Verificación de cupos disponibles
- Validación de vacante activa

### Backend
El frontend maneja todos los errores del backend:
- 401: Sesión expirada → Redirect a login
- 403: Sin permisos → Mensaje específico
- 400: Validación fallida → Muestra error
- 409: Conflicto (email duplicado)
- 404: Recurso no encontrado

## 🎯 Endpoints Implementados

- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /users` - Listar usuarios (ADMIN)
- `POST /users` - Crear usuario (ADMIN)
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario (ADMIN)
- `GET /vacancies` - Listar vacantes (con filtros)
- `POST /vacancies` - Crear vacante (ADMIN/GESTOR)
- `PATCH /vacancies/:id` - Actualizar vacante
- `PATCH /vacancies/:id/toggle-active` - Activar/Desactivar
- `DELETE /vacancies/:id` - Eliminar vacante (ADMIN)
- `GET /applications` - Listar postulaciones
- `POST /applications` - Crear postulación (CODER)
- `DELETE /applications/:id` - Eliminar postulación (ADMIN)
- `GET /users/stats/overview` - Estadísticas usuarios
- `GET /vacancies/stats/general/overview` - Estadísticas vacantes
- `GET /applications/stats/dashboard` - Dashboard de postulaciones
- `GET /applications/stats/popular/vacancies` - Vacantes populares

## 🐛 Solución de Problemas

### La página se queda en blanco
1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Abre la consola del navegador (F12) para ver errores
3. Limpia la caché del navegador o usa modo incógnito
4. Verifica que el puerto correcto esté disponible

### Error de CORS
Asegúrate de que el backend tenga configurado CORS para aceptar peticiones desde `http://localhost:8080` o `http://localhost:8081`.

### Token expirado
El token se limpia automáticamente y redirige a login. Inicia sesión nuevamente.

## 📝 Scripts Disponibles

```bash
npm run dev       # Inicia servidor de desarrollo
npm run build     # Compila para producción
npm run preview   # Previsualiza build de producción
npm run lint      # Ejecuta ESLint
```

## 🎨 Paleta de Colores (Riwi Brand)

- **Primary**: `hsl(240, 50%, 12%)` - Navy oscuro
- **Accent**: `hsl(14, 100%, 60%)` - Coral/Naranja
- **Success**: `hsl(165, 70%, 45%)` - Teal
- **Warning**: `hsl(38, 92%, 55%)` - Amber

## 📄 Licencia

Proyecto académico desarrollado para Riwi.

---

**Desarrollado con React + TypeScript + TailwindCSS**
