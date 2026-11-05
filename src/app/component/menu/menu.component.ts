import { Component, inject, ViewChild, OnInit, Input } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';

import { LoginModalComponent } from '../../componentes/login-modal/login-modal';
import { AvatarUsuarioComponent } from '../../componentes/avatar-usuario/avatar-usuario';
import { UsuarioService } from '../../servicios/usuario.service';
import { EncuestaService } from '../../servicios/encuesta';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    LoginModalComponent,
    AvatarUsuarioComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private usuarioService = inject(UsuarioService);
  private encuestaService = inject(EncuestaService);
  private router = inject(Router);
  
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // --- LOGIN ---
  usuarioLogueado: any = null;
  @ViewChild('modalLogin') modalLogin!: LoginModalComponent;

  // --- TABLA DINÁMICA (Solo para la página de inicio) ---
  data: any[] = [];
  displayedColumns: string[] = [];
  tablaTitulo: string = 'Tabla Dinámica de Inicio';
  mostrarTablaInicio = true;

  ngOnInit() {
    // Login
    if (typeof window !== 'undefined' && window.localStorage) {
      const dato = localStorage.getItem('usuario');
      if (dato) {
        this.usuarioLogueado = JSON.parse(dato);
      }
    }

    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarTablaInicio = (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '');
        if (this.mostrarTablaInicio) {
          this.cargarDatosInicio();
        }
      });

    // Carga inicial
    this.cargarDatosInicio();
  }

  cargarDatosInicio() {
    // Por defecto cargamos usuarios en la página de inicio
    this.tablaTitulo = 'Tabla Dinámica de Usuarios';
    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        this.data = data;
        
        // 🚀 MAGIA: Extraer columnas automáticamente
        if (data && data.length > 0) {
          this.displayedColumns = Object.keys(data[0]).filter(key => 
            key !== 'contrasena' && key !== 'password'
          );
        }
      },
      error: (err) => console.error('Error cargando datos:', err)
    });
  }

  abrirLogin() {
    this.modalLogin.abrirModal();
  }

  onLoginExitoso(usuario: any) {
    this.usuarioLogueado = usuario;
  }

  onSesionCerrada() {
    this.usuarioLogueado = null;
    window.location.reload();
  }

  getPropertyValue(element: any, column: string): any {
    return element[column];
  }
}