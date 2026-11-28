# HU-5 · Revisión y retroalimentación

Este módulo ya no guarda nada en el navegador: todos sus datos vienen del API (`/api/revision`) mediante `services/revisionApi.js` y `context/RevisionContext.jsx`.
El backend valida permisos y reglas de revisión; las pantallas solo muestran lo que responde el servidor.
Prueba con el servidor encendido: asesora `mquispe@ulima.edu.pe` y estudiante `rquispe@aloe.ulima.edu.pe`. Tests de lógica: `node --test src/h5-revision-retroalimentacion/tests/revision.test.mjs`.
