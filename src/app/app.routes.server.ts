// Importa los tipos y modos de renderizado específicos para el entorno del servidor (SSR/Prerendering)
import { RenderMode, ServerRoute } from '@angular/ssr';


/**
 * Configuración de rutas para el renderizado del lado del servidor.
 * Define cómo se debe generar el HTML de cada ruta durante el proceso de build (compilación).
 */
export const serverRoutes: ServerRoute[] = [
  {
    // El comodín '**' indica que esta regla se aplica a TODAS las rutas de la aplicación.
    path: '**',
    // Establece el modo de renderizado como 'Prerender'.
    // Esto genera archivos HTML estáticos en tiempo de compilación, 
    // optimizando el tiempo de carga inicial y el SEO de la aplicación.
    renderMode: RenderMode.Prerender
  }
];
