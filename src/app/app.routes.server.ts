import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    
    path: 'preguntas/:id',
    renderMode: RenderMode.Client,
  },
  {
   
    path: 'encuesta-usuario/:id',
    renderMode: RenderMode.Client,
  },
  {
   
    path: '**',
    renderMode: RenderMode.Prerender, 
  }
];