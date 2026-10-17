import { enlaceSeguro } from '../services/adaptador.js';
export default function Documento({ enlace }) {
  const url = enlaceSeguro(enlace);
  return <div className="h5-documento"><span>{url ?? 'Documento no disponible'}</span>
    {url && <a className="btn btn--primary" href={url} target="_blank" rel="noopener noreferrer">Abrir documento</a>}</div>;
}
