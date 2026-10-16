import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function enviarCorreo({ para, asunto, mensaje, enlace, textoEnlace }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { enviado: false, motivo: 'Falta configurar EmailJS en el archivo .env' };
  }
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        para,
        asunto,
        mensaje,
        enlace: enlace ? `${window.location.origin}${enlace}` : '',
        texto_enlace: textoEnlace ?? 'Abrir enlace',
      },
      { publicKey: PUBLIC_KEY }
    );
    return { enviado: true };
  } catch (error) {
    console.error('EmailJS:', error);
    return { enviado: false, motivo: 'No se pudo enviar el correo' };
  }
}