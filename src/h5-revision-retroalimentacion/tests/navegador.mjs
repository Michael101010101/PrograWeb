// Verificación con Edge/Chrome headless ya iniciado en el puerto 9225.
// Usa exclusivamente APIs de Node y CDP; no añade dependencias al proyecto.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const host = 'http://127.0.0.1:5173';
const errores = [];
const conexiones = [];
const version = await (await fetch('http://127.0.0.1:9225/json/version')).json();
const browser = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((ok, mal) => { browser.addEventListener('open', ok, { once: true }); browser.addEventListener('error', mal, { once: true }); });
let browserId = 0;
const browserPendientes = new Map();
browser.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id) { const p = browserPendientes.get(m.id); browserPendientes.delete(m.id); if (m.error) p?.reject(m.error); else p?.resolve(m.result); } });
function browserCmd(method, params = {}) { return new Promise((resolve, reject) => { const id = ++browserId; browserPendientes.set(id, { resolve, reject }); browser.send(JSON.stringify({ id, method, params })); }); }
const contextos = [];
async function nuevoContexto() { const { browserContextId } = await browserCmd('Target.createBrowserContext'); contextos.push(browserContextId); return browserContextId; }
const contexto = await nuevoContexto();
async function pestaña(browserContextId = contexto) {
  const { targetId } = await browserCmd('Target.createTarget', { url: 'about:blank', browserContextId });
  const ws = new WebSocket(`ws://127.0.0.1:9225/devtools/page/${targetId}`);
  await new Promise((ok, mal) => { ws.addEventListener('open', ok, { once: true }); ws.addEventListener('error', mal, { once: true }); });
  conexiones.push(ws);
  let id = 0;
  const pendientes = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') errores.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
    if (m.id) { const p = pendientes.get(m.id); pendientes.delete(m.id); if (m.error) p?.reject(m.error); else p?.resolve(m.result); }
  });
  function cmd(method, params = {}) { return new Promise((resolve, reject) => { const n = ++id; pendientes.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); }); }
  async function evaluar(expression) { const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description); return r.result.value; }
  async function esperar(expression) { for (let i = 0; i < 100; i++) { if (await evaluar(expression)) return; await new Promise((r) => setTimeout(r, 100)); } throw new Error('Tiempo agotado: ' + expression + '\n' + await evaluar('document.body.innerText')); }
  async function ir(ruta) { await cmd('Page.navigate', { url: host + ruta }); }
  async function recargar() { const antes = await evaluar('performance.timeOrigin'); await cmd('Page.reload'); await esperar(`performance.timeOrigin!==${antes} && !!document.querySelector('.h5')`); }
  async function escribir(selector, value) { await evaluar(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); if(!e)throw Error('Campo no encontrado'); const setter=Object.getOwnPropertyDescriptor(e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set; setter.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event('input',{bubbles:true})); })()`); }
  async function click(texto) { await evaluar(`(() => { const e=[...document.querySelectorAll('button,a')].find(e=>e.textContent.trim()===${JSON.stringify(texto)}); if(!e)throw Error('Control no encontrado: '+${JSON.stringify(texto)}); e.click(); })()`); }
  async function capturar(nombre) { const r = await cmd('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); const path = join(tmpdir(), 'hu5-' + nombre + '.png'); writeFileSync(path, Buffer.from(r.data, 'base64')); console.log('CAPTURA', path); }
  await cmd('Runtime.enable'); await cmd('Page.enable');
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  return { cmd, evaluar, esperar, ir, recargar, escribir, click, capturar };
}
async function login(p, ruta, correo) {
  await p.ir(ruta); await p.esperar("!!document.querySelector('input[name=correo]')");
  await p.escribir('input[name=correo]', correo); await p.escribir('input[name=password]', 'Tfc2026!');
  await p.click('Ingresar'); await p.esperar("!!document.querySelector('.app-header__user-name')");
  await p.ir(ruta); await p.esperar(`location.pathname===${JSON.stringify(ruta)} && !!document.querySelector('.h5')`);
}
try {
  const a = await pestaña();
  await login(a, '/asesor/revision', 'mquispe@ulima.edu.pe');
  await a.esperar("document.body.innerText.includes('Diseño metodológico')");
  await a.capturar('bandeja');
  await a.click('Revisar'); await a.esperar("!!document.querySelector('#correcciones')");
  await a.capturar('revision');
  const e = await pestaña();
  await login(e, '/estudiante/retroalimentacion', 'rquispe@aloe.ulima.edu.pe');
  await e.ir('/estudiante/retroalimentacion?trabajo=TFC-2026-2-047&entregable=e-047-3&version=av-06');
  await e.esperar("document.body.innerText.includes('Diseño metodológico · v2')");
  await a.click('Observar avance');
  await a.esperar("document.querySelector('#correcciones').getAttribute('aria-invalid')==='true'");
  assert.equal(await a.evaluar("document.querySelector('#correcciones').getAttribute('aria-invalid')"), 'true');
  const texto = 'Corrige la justificación de la muestra y detalla las métricas de validación.';
  await a.escribir('#correcciones', texto); await a.click('Observar avance');
  await a.esperar("!!document.querySelector('[role=dialog]')");
  await e.esperar(`document.body.innerText.includes(${JSON.stringify(texto)})`);
  await e.click('Responder a este comentario');
  await e.escribir('textarea', 'De acuerdo, corregiré la muestra y añadiré las métricas indicadas.');
  await e.click('Enviar respuesta');
  await a.esperar("document.body.innerText.includes('De acuerdo, corregiré la muestra')");
  console.log('PASS: asesor observa; estudiante recibe sin recargar, responde; asesor recibe sin recargar');
  await e.recargar(); await e.esperar("document.body.innerText.includes('De acuerdo, corregiré la muestra')");
  await a.recargar(); await a.esperar("document.body.innerText.includes('De acuerdo, corregiré la muestra')");
  assert.match(await a.evaluar('document.body.innerText'), /Observado/);
  assert.equal(await e.evaluar("[...document.querySelectorAll('button')].some(b=>['Aprobar avance','Observar avance'].includes(b.textContent))"), false);
  console.log('PASS: ambas cuentas permanecen separadas al recargar; comentarios y estado persisten');
  await e.ir('/estudiante/retroalimentacion/historial/e-047-1'); await e.esperar("document.body.innerText.includes('Historial de versiones')");
  await e.capturar('historial');
  assert.equal(await e.evaluar("document.querySelectorAll('details.h5-version').length"), 3);
  await e.ir('/estudiante/retroalimentacion/trabajo/TFC-2026-2-047'); await e.esperar("document.body.innerText.includes('Línea de tiempo del trabajo')");
  assert.equal(await e.evaluar("document.querySelector('.h5-progreso progress').value"), 35);
  await e.capturar('consolidado');
  await e.cmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await e.capturar('movil');
  assert.equal(await e.evaluar('document.documentElement.scrollWidth > window.innerWidth'), false);
  await e.ir('/estudiante/retroalimentacion/trabajo/TFC-2026-2-012'); await e.esperar("document.body.innerText.includes('Trabajo no disponible')");
  await a.ir('/asesor/revision/av-012-1'); await a.esperar("document.body.innerText.includes('Avance no disponible')");
  console.log('PASS: historial conserva tres versiones; observado mantiene 35%; móvil sin desbordamiento; otros trabajos inaccesibles');
  const otra = await pestaña();
  await login(otra, '/asesor/revision', 'jvargas@ulima.edu.pe');
  assert.equal(await otra.evaluar("document.body.innerText.includes('Modelo predictivo')"), false);
  await otra.ir('/asesor/revision/av-012-1'); await otra.esperar("document.body.innerText.includes('Plan de investigación · versión 1')");
  assert.equal(await otra.evaluar("document.body.innerText.includes('Aprobar avance')"), false);
  console.log('PASS: segundo asesor ve exclusivamente sus trabajos; trabajo concluido en lectura');
  const contextoAprobacion = await nuevoContexto();
  const aprobador = await pestaña(contextoAprobacion);
  await login(aprobador, '/asesor/revision', 'mquispe@ulima.edu.pe');
  await aprobador.click('Revisar'); await aprobador.esperar("!!document.querySelector('#correcciones')");
  const lector = await pestaña(contextoAprobacion);
  await login(lector, '/estudiante/retroalimentacion', 'rquispe@aloe.ulima.edu.pe');
  await lector.ir('/estudiante/retroalimentacion/trabajo/TFC-2026-2-047'); await lector.esperar("!!document.querySelector('.h5-progreso progress')");
  await aprobador.click('Aprobar avance'); await aprobador.esperar("document.body.innerText.includes('35% a 55%')");
  await lector.esperar("document.querySelector('.h5-progreso progress')?.value===55");
  await lector.recargar(); await lector.esperar("document.querySelector('.h5-progreso progress')?.value===55");
  await aprobador.recargar(); await aprobador.esperar("!!document.querySelector('#correcciones')");
  assert.equal(await aprobador.evaluar("[...document.querySelectorAll('button')].some(b=>b.textContent==='Aprobar avance')"), false);
  console.log('PASS: aprobación 35% → 55% sincronizada y persistida; no permite aprobar de nuevo');
  assert.deepEqual(errores, []);
  console.log('PASS: sin excepciones de JavaScript en el navegador');
} finally {
  for (const ws of conexiones) ws.close();
  for (const browserContextId of contextos) await browserCmd('Target.disposeBrowserContext', { browserContextId });
  browser.close();
}
