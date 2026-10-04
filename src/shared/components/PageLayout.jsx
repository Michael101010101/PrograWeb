import Header from './Header.jsx';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

/**
 * Estructura común de cada página: cabecera + navegación por rol + contenido + footer.
 * Todas las historias deben envolver sus vistas con este componente.
 */
export default function PageLayout({
  children,
  headerSlot,
  accionesPublicas,
  navExtra,
  navInfo,
  navContadores,
  footerDetalle,
  centrado = false,
}) {
  return (
    <div className="app-shell">
      <Header slot={headerSlot} accionesPublicas={accionesPublicas} />
      <NavBar extra={navExtra} info={navInfo} contadores={navContadores} />
      <main className={`page-content ${centrado ? 'page-content--center' : ''}`}>
        <div className="page-content__inner">{children}</div>
      </main>
      <Footer detalle={footerDetalle} />
    </div>
  );
}
