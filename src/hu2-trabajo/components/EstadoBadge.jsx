import { ESTADOS } from '../config.js';
import './estadosTrabajo.css';

const CLASES = {
  propuesta: 'hu2-badge-propuesta',
  en_desarrollo: 'hu2-badge-desarrollo',
  concluido: 'hu2-badge-concluido',
  desistido: 'hu2-badge-desistido',
};

export default function EstadoBadge({ estado }) {
  return <span className={CLASES[estado]}>{ESTADOS[estado]?.label ?? estado}</span>;
}