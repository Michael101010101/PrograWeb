

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
