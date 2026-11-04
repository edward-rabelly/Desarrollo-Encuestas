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

  // --- TABLA GENÉRICA ---
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = []; // Se llenará solo
  tablaTitulo: string = 'Tabla Dinámica';

  ngOnInit() {
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
        this.cargarDatosSegunRuta(event.urlAfterRedirects);
      });

    // Carga inicial
    this.cargarDatosSegunRuta(this.router.url);
  }

  cargarDatosSegunRuta(url: string) {
    let servicioObservable: Observable<any>;

    // 1. Decidimos qué servicio usar según la URL
    if (url.includes('/Usuario')) {
      this.tablaTitulo = 'Tabla de Usuarios';
      servicioObservable = this.usuarioService.getClientes();
    } else if (url.includes('/encuesta')) {
      this.tablaTitulo = 'Tabla de Encuestas';
      servicioObservable = this.encuestaService.getEncuestas();
    } else {
      this.tablaTitulo = 'Tabla de Usuarios';
      servicioObservable = this.usuarioService.getClientes();
    }

    // 2. Nos suscribimos y extraemos las columnas AUTOMÁTICAMENTE
    servicioObservable.subscribe({
      next: (data) => {
        this.data = data;
        
        // 🚀 AQUÍ ESTÁ LA MAGIA (Igual que en las imágenes de tu profe)
        if (data && data.length > 0) {
          // Obtenemos las llaves del primer objeto y filtramos las que no queremos mostrar
          this.displayedColumns = Object.keys(data[0]).filter(key => 
            key !== 'contrasena' && key !== 'password' // Ocultar datos sensibles
          );
        } else {
          this.displayedColumns = [];
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