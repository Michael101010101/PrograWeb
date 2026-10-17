// Pequeñas ayudas para armar textos de la HU-4.

// "tu asesora" -> "Tu asesora"
export const capitalizar = (texto) => texto[0].toUpperCase() + texto.slice(1);

// ['a', 'b', 'c'] -> "a, b y c"
export const unirConY = (lista) =>
  lista.length > 1 ? `${lista.slice(0, -1).join(', ')} y ${lista.at(-1)}` : lista.join('');

// (1, 'entregable') -> "1 entregable" · (2, 'entregable') -> "2 entregables"
export const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? '' : 's'}`;
