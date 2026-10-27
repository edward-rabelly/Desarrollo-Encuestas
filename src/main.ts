// Importa la función principal para iniciar (bootstrap) una aplicación Angular Standalone en el navegador
import { bootstrapApplication } from '@angular/platform-browser';
// Importa la configuración del lado del cliente (Rutas, HttpClient, Hidratación, etc.)
import { appConfig } from './app/app.config';
// Importa el componente raíz de la aplicación
import { App } from './app/app';

/**
 * Punto de entrada principal de la aplicación (Client-Side Bootstrap).
 * Inicializa el componente raíz (App) en el navegador utilizando la configuración del cliente.
 */
bootstrapApplication(App, appConfig)
   

// Bloque de manejo de errores global: 
  // Si algo falla catastróficamente durante el arranque de la app, lo captura y lo muestra en la consola
  // en lugar de dejar la página en blanco sin explicación.
  .catch((err) => console.error(err));
