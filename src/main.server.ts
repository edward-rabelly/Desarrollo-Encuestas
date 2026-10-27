// Importa las herramientas necesarias para iniciar (bootstrap) la aplicación en el servidor
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
// Importa el componente raíz de la aplicación (el "enchufe" principal)
import { App } from './app/app';
// Importa la configuración específica del servidor (SSR + Prerendering)
import { config } from './app/app.config.server';


/**
 * Función de arranque (bootstrap) para el entorno del servidor (Node.js).
 * Esta función se ejecuta cuando el servidor necesita pre-renderizar la aplicación.
 * 
 * @param context - El contexto del servidor que proporciona información sobre la petición HTTP entrante
 * @returns Una promesa con la aplicación Angular renderizada en el servidor
 */
const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);


// Exporta la función de bootstrap como módulo por defecto para que el servidor de Node.js pueda usarla
export default bootstrap;


//okey tenemos bootstrapapplication para todo lo que tenga que ver con app (que seria app.ts) junto con su vista y su estructura, 
// cuando verifique y coincida todo que esta hay hace una accion llamado bootstrap que dentro puede cambiar su informacion
//  pero no la estrucura y por ultimo que lo exporte
