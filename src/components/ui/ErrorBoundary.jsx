import { Component } from 'react';

/** Captura errores de renderizado para no dejar la pantalla en blanco */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error de interfaz:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="state state--error state--page" role="alert">
        <div className="state__icon" aria-hidden="true">
          !
        </div>
        <h2 className="state__title">Ocurrió un error inesperado</h2>
        <p className="state__msg">Intenta recargar la página. Si el problema continúa, contáctanos.</p>
        <button className="btn btn--outline btn--md" onClick={() => window.location.reload()}>
          <span>Recargar</span>
        </button>
      </div>
    );
  }
}
