# Trabajos de Fin de Carrera · Programación Web 2026-2 (Tema 10)

Entrega 1: interfaz en React (Vite + JavaScript) con datos manejados en el front.

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:5173
```

Para volver a los datos semilla, borra en el navegador las claves `tfc.*` de localStorage
(DevTools → Application → Local Storage).

## Estructura

```
src/
  data/seed.json          Datos semilla compartidos (contrato de datos del grupo)
  routes/AppRouter.jsx    Todas las rutas; cada HU reemplaza sus <EnConstruccion />
  shared/                 Módulo común (a cargo del grupo)
    components/           PageLayout, Header, NavBar, Footer, Modal, ConfirmDialog,
                          ToastProvider, EmptyState, Alert, FormField, RoleBadge, PageHead
    config/               roles, navegación por rol, periodo y contacto
    styles/               tokens del sistema de diseño + estilos comunes
    integraciones.js      Lecturas entre historias (HU-2, HU-3…)
  hu1-cuenta/             HU-1 · Cuenta y acceso
    context/AuthContext   Sesión global (useAuth)
    guards/               RutaProtegida (por rol) y SoloPublico
    services/             authService (lógica) + repositorios (acceso a datos)
    utils/                validaciones y hash
    pages/                vistas 1.1 a 1.7 + invitaciones, verificación y 404
```

Capas: las páginas llaman a `authService`; solo los repositorios tocan el almacenamiento.
En la entrega 2 los repositorios pasan a llamar a la API de Express y las páginas no cambian.
Las validaciones de `utils/validators.js` son funciones puras y se reutilizan en el servidor.

## Cuentas de prueba (contraseña: `Tfc2026!`)

| Correo | Rol | Estado |
| --- | --- | --- |
| rquispe@aloe.ulima.edu.pe | Estudiante | Activo |
| drojas@aloe.ulima.edu.pe | Estudiante | Activo |
| bpalomino@aloe.ulima.edu.pe | Estudiante | Sin verificar |
| jtapia@aloe.ulima.edu.pe | Estudiante | Bloqueado |
| mquispe@ulima.edu.pe | Asesor | Activo |
| achavez@ulima.edu.pe | Asesor | Pendiente de validación |
| cvelasquez@ulima.edu.pe | Administrador | Activo |

Invitación de coordinación vigente: `/registro/coordinador?invitacion=INV-7K2P-94QX`
(correo lmorales@ulima.edu.pe).

## Cómo usan la HU-1 las demás historias

```jsx
import { useAuth } from '../hu1-cuenta/context/AuthContext.jsx';
import PageLayout from '../shared/components/PageLayout.jsx';
import { useToast } from '../shared/components/ToastProvider.jsx';

const { usuario } = useAuth();          // { id, rol, nombres, apellidos, correo, … }
<PageLayout headerSlot={<MiChip />}>…</PageLayout>
```

Rutas protegidas: se agregan dentro del grupo de su rol en `AppRouter.jsx`.
