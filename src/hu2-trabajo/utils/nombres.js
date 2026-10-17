export function inicialesDeNombre(nombre = '') {
  const partes = nombre.replace(/^(Dra?|Mg|Ing|Lic)\.\s*/i, '').split(/\s+/).filter(Boolean);
  const apellido = partes.length >= 3 ? partes[partes.length - 2] : partes[1];
  return `${partes[0]?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
}