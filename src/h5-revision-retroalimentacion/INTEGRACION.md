> Actualizaci?n de integraci?n: la vista consolidada del trabajo en desarrollo se muestra en /estudiante/mi-trabajo. La antigua ruta del estudiante redirige all?; el asesor conserva su consulta consolidada. HU-4 y HU-5 leen tfc.entregables y proyectan las decisiones de tfc.hu5.evento.v1.* sin duplicarlas en las versiones base. HU-2 aporta t?tulo, estado, integrantes y asesor desde tfc.trabajos. El plan relee el almacenamiento antes de cada acci?n y escucha cambios locales y de otras pesta?as. Las fechas de HU-4 usan el calendario actual de Lima. Esta persistencia sigue siendo local al navegador: Git comparte c?digo, no entregas ni revisiones entre computadoras. La asignaci?n din?mica desde HU-3 y el backend siguen pendientes. Las secciones siguientes describen la implementaci?n original y sus pasos hist?ricos.

# HU-5 · Revisión y retroalimentación

Implementación frontend con datos persistidos en el navegador. No requiere dependencias nuevas ni modifica HU-1, HU-2, HU-3 o HU-4. Único ajuste fuera del módulo: rutas HU-5 en `src/routes/AppRouter.jsx`.

## Ejecutar en otra computadora

Requisitos: Git, npm y una versión de Node compatible con Vite (`^20.19.0 || >=22.12.0`; verificado con Node 24.20.0). No se necesita backend, base de datos, archivo .env, documentos de Downloads ni almacenamiento previo del navegador.

```sh
git clone --branch h5-revision-retroalimentacion --single-branch https://github.com/Michael101010101/PrograWeb.git
cd PrograWeb
npm install
npm run dev
```

Abrir la URL que indique Vite (normalmente http://localhost:5173). En Windows PowerShell, si la política de ejecución bloquea npm.ps1, usar `npm.cmd install` y `npm.cmd run dev`.

Los archivos semilla y las rutas están incluidos en esta rama. En un navegador sin datos se inicia el escenario demo automáticamente. La instalación limpia fue verificada con una copia de los archivos del índice Git, sin reutilizar node_modules: instalación, build, 11 pruebas y lint de HU-5 aprobados, servidor Vite iniciado correctamente. Los cinco errores previos del lint global en HU-1 y ToastProvider no impiden ejecutar esta versión.

## Demostración con dos pestañas

1. Ejecutar `npm run dev` y abrir dos pestañas independientes del mismo origen (mismo protocolo, host y puerto).
2. Iniciar sesión **sin marcar Recordarme** en ambas. HU-1 ya utiliza `sessionStorage` para esta modalidad: cada pestaña conserva su propia cuenta al recargar. No usar la sesión persistente compartida de `Recordarme` para probar dos identidades.
3. Asesor: `mquispe@ulima.edu.pe`, contraseña de semilla `Tfc2026!`; ir a `/asesor/revision` y revisar Diseño metodológico v2.
4. Estudiante: `rquispe@aloe.ulima.edu.pe`, misma contraseña; ir a `/estudiante/retroalimentacion`, seleccionar Diseño metodológico y versión 2.
5. Publicar un comentario o indicar una observación de 30–800 caracteres. El estudiante la verá sin recargar; puede responder al comentario seleccionado. El asesor verá la respuesta sin recargar.
6. Recargar ambas pestañas para comprobar conservación de datos y cuentas. Consultar historial y trabajo consolidado desde los enlaces del módulo.

Semilla demo: formato tomado de `origin/Michael-h4`, archivo `data/datosSemilla.js` (copia de referencia en `data/referenciaHu4.js`). La única diferencia del escenario es dejar `av-06` en revisión para demostrar la decisión del asesor. El trabajo TFC-2026-2-047 inicia con 35%; aprobar esa versión suma 20 puntos y muestra 55%. Observar mantiene 35%. Versiones anteriores permanecen intactas. Los enlaces de Drive son ejemplos del compañero: la apertura funciona, pero no representan documentos reales garantizados.

Otras cuentas: Diego `u-002` comparte el trabajo de Rosa; Diana `u-004` y Julio `u-102` corresponden al trabajo concluido TFC-2026-2-012. Usuarios sin relación no reciben trabajos; coordinadores no tienen rutas HU-5. No se crearon cuentas adicionales.

## Persistencia y sincronización

- `tfc.hu5.catalogo.v1`: catálogo de demostración. Se guarda al realizar la primera acción cuando no existe HU-4.
- `tfc.hu5.evento.v1.<UUID>`: un evento por comentario, respuesta, aprobación u observación; contiene avanceId, tipo, texto, autorId, autor, rol, fecha ISO y respuestaA cuando corresponde.
- `tfc.hu4`: solo lectura mediante `services/adaptador.js`; si existe, reemplaza el catálogo demo y se proyectan encima los eventos HU-5.
- `storage` actualiza otras pestañas; un evento local actualiza la pestaña que escribió. `useSyncExternalStore` suscribe React y mantiene snapshots estables.
- Cada escritura relee los datos y valida identidad, pertenencia, versión actual y estado. Web Locks serializa decisiones entre pestañas en navegadores compatibles; claves independientes y una sola decisión efectiva por versión evitan perder comentarios o duplicar porcentajes.
- Datos corruptos o escritura rechazada muestran error; no se restauran ni sobrescriben silenciosamente.

## Contrato de lectura a conectar

| Entidad | Campos utilizados | Responsable |
|---|---|---|
| Usuario | id, rol, nombres, apellidos | HU-1 (sesión existente) |
| Trabajo | codigo, titulo, linea, estado, integrantes: usuarioId[], asesor: {usuarioId, nombre} | HU-2 y asignación HU-3 |
| Entregable | id, trabajoCodigo, orden, nombre, peso, obligatorio, fechaLimite (YYYY-MM-DD) | HU-4 |
| Avance/version | id estable, entregableId, version numérica, fecha, diasRetraso, enlace http/https, descripcion, estado | HU-4 |
| Revisión importada | fecha, comentario, revisor; opcional revisorId | Contrato actual HU-4 |

Estados de versión admitidos: `en_revision`, `observado`, `aprobado`. Trabajo editable: `en_desarrollo`. El estado del entregable deriva de su última versión; sin versiones es pendiente o vencido según la fecha de Lima. Solo se decide sobre la última versión pendiente. El progreso usa una vez el peso de cada entregable obligatorio cuya última versión está aprobada, de acuerdo con el servicio actual de HU-4; no se incrementa un contador acumulativo.

El adaptador admite integrantes como ids o como objetos con usuarioId, pero el asesor debe resolverse a un usuarioId explícito. No asigna permisos por nombre, correo ni por suposición. Para mostrar quién registró cada avance conviene incorporar autorId/autor al contrato; si falta se muestra «Equipo del trabajo». Los nombres del equipo usan los perfiles semilla como respaldo.

## Integración pendiente con los compañeros

1. Conectar las entidades reales de HU-2 y HU-3 a un catálogo único; resolver asesorId de HU-3 a asesor.usuarioId. No importar a ciegas objetos con relaciones ambiguas.
2. Sustituir la copia demo por un lector acordado de los servicios HU-4. Mantener los ids de versiones estables para relacionar los eventos existentes.
3. Acordar cómo HU-4 consume las decisiones HU-5: actualmente su plan no conoce los eventos de este módulo. HU-5 no escribe estados ni revisiones en `tfc.hu4`.
4. Evitar que HU-4 guarde snapshots antiguos: añadir sincronización entre pestañas y releer antes de escribir desde su propio módulo, en coordinación con su responsable.
5. Registrar una nueva versión observada mediante HU-4. HU-5 permite responder y revisar, pero no incorpora un formulario de presentación de avances.
6. Conectar «Mi trabajo» de HU-2 y el registro de HU-4 a la consolidada y al historial. Por ahora ambas vistas están bajo rutas HU-5 para no reemplazar funcionalidades ajenas.
7. En la entrega backend, reemplazar el repositorio por API; los permisos deben validarse en servidor. localStorage es almacenamiento frontend, no una barrera contra manipulación manual de datos.

No se afirma envío de correos ni notificaciones externas. Los resultados indican que la retroalimentación está disponible para el equipo.

## Comprobaciones

```text
node --test src/h5-revision-retroalimentacion/tests/revision.test.mjs
node node_modules/eslint/bin/eslint.js src/h5-revision-retroalimentacion src/routes/AppRouter.jsx
npm run build
```

`tests/navegador.mjs` comprueba el flujo con Edge/Chrome headless iniciado en puerto 9225 y Vite en 5173. Utiliza CDP y APIs de Node; no instala Playwright ni otras dependencias. Las capturas se escriben únicamente en la carpeta temporal. El perfil de pruebas debe estar separado del navegador de uso diario.

Referencia visual: PDF Tema10_Mockups_f.pdf, páginas 35–40. Bandeja, revisión en dos columnas, historial desplegable, consolidada, mensajes de resultado y estados vacíos. Se reutilizan PageLayout, PageHead, Modal, Alert, EmptyState y ToastProvider; estilos propios limitados a las vistas HU-5.
