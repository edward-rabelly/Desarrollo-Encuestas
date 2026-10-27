// Importa las herramientas de Angular para integrar la app con un servidor Node.js

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

// Importa Express, el framework web estándar para Node.js
import express from 'express';
// Importa 'join' para construir rutas de archivos de forma segura entre sistemas operativos
import { join } from 'node:path';

// Define la carpeta donde Angular guardó los archivos estáticos compilados (JS, CSS, imágenes)
const browserDistFolder = join(import.meta.dirname, '../browser');

// Inicializa la aplicación de Express y el motor de renderizado de Angular
const app = express();
const angularApp = new AngularNodeAppEngine();


// 1. SERVICIO DE ARCHIVOS ESTÁTICOS (Optimización de Rendimiento)
// Sirve archivos como JS, CSS, imágenes e iconos directamente desde la carpeta 'browser'.
// 'maxAge: 1y' le dice al navegador del usuario que guarde estos archivos en caché  
// haciendo que las visitas posteriores sean instantáneas.
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// 2. MIDDLEWARE DE RENDERIZADO SSR (Fallback Dinámico)
// Si la petición NO es un archivo estático (ej. el usuario entra a /Usuario), 
// Angular toma el control y renderiza la página en el servidor en tiempo real.
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      // Si Angular generó una respuesta, la envía al cliente. Si no, pasa al siguiente middleware.
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    // Manejo de errores: si algo falla, lo pasa al manejador de errores de Express
    .catch(next);
});

// 3. INICIO DEL SERVIDOR (Solo si se ejecuta directamente o con PM2)
// Verifica si este archivo es el punto de entrada principal o si lo ejecuta un gestor de procesos (PM2)
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  // Usa el puerto definido en las variables de entorno, o el 4000 por defecto
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// 4. EXPORTACIÓN PARA ENTORNOS SERVERLESS (Firebase, Vercel, Angular CLI)
// Crea y exporta un manejador de peticiones compatible con funciones en la nube 
// o con el servidor de desarrollo de Angular (ng serve).
export const reqHandler = createNodeRequestHandler(app);

// En producción, el servidor Node.js (server.ts) gestiona las peticiones y sirve el index.html. 
// Este actúa como contenedor base que alberga el punto de montaje <app-root>. 
// El script main.ts inicializa el framework, inyectando el AppComponent, el cual delega la estructura visual al MenuComponent.
// Finalmente, el Router gestiona la carga perezosa (lazy loading) de las vistas específicas (como Usuarios o Encuestas) 
// dentro del <router-outlet>, garantizando una experiencia de usuario fluida y sin recargas de página."