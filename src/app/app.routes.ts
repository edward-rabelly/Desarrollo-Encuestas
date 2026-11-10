import { Routes } from '@angular/router';
import { UsuarioComponent } from './vista/usuario/usuario';
import { Component } from '@angular/core';
import { EncuestaComponent } from './vista/encuesta/encuesta';
import { PreguntasComponent } from './vista/preguntas/preguntas';
import { EncuestaUsuarioComponent } from './vista/encuesta-usuario/encuesta-usuario';



/**
 * Componente de Inicio (Home).
 * Actúa como la página de bienvenida o "Landing Page" cuando el usuario entra a la raíz de la app.
 * Es un componente Standalone con una plantilla en línea (inline template).
 */
// Componente de Inicio simple y vacío
@Component({
  standalone: true,
  template: `<div></div>` // Página completamente en blanco
})
export class InicioComponent {}


export const routes: Routes = [
     // Ruta raíz (''). Muestra el InicioComponent cuando la URL está vacía (ej. http://localhost:4200/)
    { path: '',            component: InicioComponent },
    // Ruta para el módulo de Usuarios. Se activa al navegar a /Usuario
    { path: 'Usuario',     component: UsuarioComponent },
    // Ruta para el módulo de Encuestas. Se activa al navegar a /encuesta
    { path: 'encuesta',    component: EncuestaComponent },
    { path: 'preguntas', component: PreguntasComponent },
    { path: 'encuesta-usuario', component: EncuestaUsuarioComponent },
    { path: 'preguntas/:id', component: PreguntasComponent },
    { path: '**',          redirectTo: '' }
];

//es la pantalla vista del inicio de la aplicacion