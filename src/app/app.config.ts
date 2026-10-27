// Importa el tipo de configuración y el listener de errores globales del navegador
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// Importa el proveedor para configurar el enrutamiento de la aplicación
import { provideRouter } from '@angular/router';

// Importa las rutas definidas en el archivo app.routes.ts
import { routes } from './app.routes';
// Importa las herramientas para la Hidratación del Cliente (esencial para SSR)
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// Importa el proveedor del cliente HTTP para hacer peticiones a la API (Backend)

import { provideHttpClient, withFetch } from '@angular/common/http';

/**
 * Configuración principal de la aplicación (Client-Side).
 * Define los proveedores globales que estarán disponibles en toda la aplicación.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Captura y maneja errores no controlados a nivel global en el navegador
    provideBrowserGlobalErrorListeners(),
     // 2. Configura el enrutador con las rutas definidas en 'app.routes'
    provideRouter(routes), 
    // 3. Habilita la hidratación del cliente para SSR. 
    // 'withEventReplay()' asegura que si el usuario hace clic mientras la app carga, 
    // ese evento no se pierda y se ejecute cuando Angular termine de inicializarse.
    provideClientHydration(withEventReplay()),
      // 4. Registra el HttpClient a nivel global, permitiendo que los Servicios 
    // lo inyecten para comunicarse con el backend de Node.js
    provideHttpClient(withFetch())
  ]
};
