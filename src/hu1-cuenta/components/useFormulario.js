import { useCallback, useMemo, useState } from 'react';

/**
 * Manejo de formularios con validación junto al campo.
 *  - valida un campo al salir de él (blur) y lo revalida mientras se corrige
 *  - validarTodo() marca todos los campos antes de enviar
 * `validar(valores)` debe devolver un objeto { campo: 'mensaje' } solo con los errores.
 */
export default function useFormulario(inicial, validar) {
  const [valores, setValores] = useState(inicial);
  const [base, setBase] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  const onChange = useCallback(
    (e) => {
      const { name, type, value, checked } = e.target;
      const nuevos = { ...valores, [name]: type === 'checkbox' ? checked : value };
      setValores(nuevos);
      if (tocados[name] || errores[name]) {
        const todos = validar(nuevos);
        setErrores((prev) => {
          const sig = { ...prev, [name]: todos[name] };
          // al cambiar la contraseña se recalcula su confirmación
          if (prev.confirmacion !== undefined) sig.confirmacion = todos.confirmacion;
          return sig;
        });
      }
    },
    [valores, tocados, errores, validar]
  );

  const onBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTocados((prev) => ({ ...prev, [name]: true }));
      setErrores((prev) => ({ ...prev, [name]: validar(valores)[name] }));
    },
    [validar, valores]
  );

  const validarTodo = useCallback(() => {
    const todos = validar(valores);
    setErrores(todos);
    setTocados(Object.fromEntries(Object.keys(valores).map((k) => [k, true])));
    return Object.values(todos).filter(Boolean).length === 0;
  }, [validar, valores]);

  const reiniciar = useCallback((nuevos) => {
    const v = nuevos ?? base;
    setValores(v);
    setBase(v);
    setErrores({});
    setTocados({});
  }, [base]);

  const modificado = useMemo(() => JSON.stringify(valores) !== JSON.stringify(base), [valores, base]);
  const cantidadErrores = Object.values(errores).filter(Boolean).length;

  /** Atajo para conectar un campo: <TextField {...props('nombres')} /> */
  const props = (name) => ({ name, value: valores[name] ?? '', onChange, onBlur, error: errores[name] });

  return { valores, setValores, errores, setErrores, onChange, onBlur, validarTodo, reiniciar, modificado, cantidadErrores, props };
}
