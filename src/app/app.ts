// Importa el decorador necesario para definir un componente en Angular
import { Component, OnInit } from '@angular/core';
import { AuthService } from './servicios/auth.service';
// Importa el componente que actuará como el Layout Maestro de toda la aplicación
import { MenuComponent } from './component/menu/menu.component';
import { RouterOutlet } from '@angular/router';


/**
 * Componente Raíz (Root Component) de la aplicación.
 * Actúa como el punto de entrada (bootstrap) y contenedor principal.
 */
@Component({
  selector: 'app-root', // La etiqueta HTML que representa a este componente (<app-root>), index busca esta clase para que la pinte
  standalone: true,  // Arquitectura moderna: no requiere un AppModule (NgModule)
  imports: [MenuComponent,RouterOutlet], // Importa directamente el componente del menú para poder usarlo en el HTML
  templateUrl: './app.html',// Vincula la plantilla HTML (que contiene <app-menu></app-menu>)
  styleUrl: './app.css' // Vincula los estilos globales de la aplicación
})
export class App implements OnInit {
  
  protected readonly title = 'Edward_Proyecto';
  
  // 👇 Estado global para saber si mostrar el botón de Login o el Avatar
  usuarioLogueado = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // 👇 Escuchar en tiempo real si el usuario inicia o cierra sesión
    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuarioLogueado = !!usuario; // true si hay usuario, false si es null
    });
  }

  // 👇 Método que recibe el evento del modal cuando el login es exitoso
  onLoginExitoso(usuario: any) {
    this.usuarioLogueado = true;
  }

  // 👇 Método que recibe el evento del avatar cuando se cierra sesión
  onSesionCerrada() {
    this.usuarioLogueado = false;
  }
}