// Límite de error para las piezas que se cargan aparte (videos de Remotion): si su archivo no llega (red móvil, o
// un despliegue nuevo con otros nombres de archivo mientras la página estaba abierta), se oculta solo esa pieza
// en vez de dejar toda la página en blanco.
import { Component, type ReactNode } from 'react';

export class Limite extends Component<{ children: ReactNode; fallback?: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  render() {
    return this.state.fallo ? (this.props.fallback ?? null) : this.props.children;
  }
}
