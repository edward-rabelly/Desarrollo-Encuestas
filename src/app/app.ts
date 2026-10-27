// Importa el decorador necesario para definir un componente en Angular
import { Component } from '@angular/core';

// Importa el componente que actuará como el Layout Maestro de toda la aplicación
import { MenuComponent } from './component/menu/menu.component';


/**
 * Componente Raíz (Root Component) de la aplicación.
 * Actúa como el punto de entrada (bootstrap) y contenedor principal.
 */
@Component({
  selector: 'app-root', // La etiqueta HTML que representa a este componente (<app-root>), index busca esta clase para que la pinte
  standalone: true,  // Arquitectura moderna: no requiere un AppModule (NgModule)
  imports: [MenuComponent], // Importa directamente el componente del menú para poder usarlo en el HTML
  templateUrl: './app.html',// Vincula la plantilla HTML (que contiene <app-menu></app-menu>)
  styleUrl: './app.css' // Vincula los estilos globales de la aplicación
})
export class App {

  /**
   * Propiedad inmutable que define el nombre o título del proyecto.
   * Se puede utilizar en la plantilla HTML mediante interpolación: {{ title }}
   * (Este es el valor que el archivo app.spec.ts intenta verificar en sus pruebas).
   */
  protected readonly title = 'Edward_Proyecto';
}

// se puede decir el app.ts es para tener lo basico y menucomponent para estructurar todo, porque asi? para evitar hacer todo desde cero
//  si llegue hacer un cambio