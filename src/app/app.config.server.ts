// Importa las herramientas de Angular Core para manejar configuraciones de la aplicación
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
// Importa las funciones específicas para habilitar el Renderizado del Lado del Servidor (SSR)
import { provideServerRendering, withRoutes } from '@angular/ssr';
// Importa la configuración base de la aplicación (la que usa el navegador)
import { appConfig } from './app.config';
// Importa las rutas específicas que el servidor necesita conocer para pre-renderizar
import { serverRoutes } from './app.routes.server';

/**
 * Configuración específica para el entorno del servidor (Node.js).
 * Define los proveedores que solo deben estar activos cuando la aplicación 
 * se ejecuta en el servidor, no en el navegador del cliente.
*/
const serverConfig: ApplicationConfig = {
  // Habilita el Server-Side Rendering (SSR) y le pasa las rutas del servidor
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

/**
 * Fusiona la configuración base del cliente (appConfig) con la configuración 
 * específica del servidor (serverConfig). 
 * Esto garantiza que la aplicación tenga todo lo necesario para ejecutarse 
 * de forma universal (tanto en el servidor como en el navegador).
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
