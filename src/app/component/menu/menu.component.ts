import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Necesario para *ngIf
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


import { LoginModalComponent } from '../../componentes/login-modal/login-modal';
import { AvatarUsuarioComponent } from '../../componentes/avatar-usuario/avatar-usuario';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, // <-- Agregado
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    LoginModalComponent,    // <-- Agregado
    AvatarUsuarioComponent  // <-- Agregado
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // 👇 VARIABLES Y MÉTODOS PARA EL LOGIN 👇
  usuarioLogueado: any = null;
  
  // Referencia al modal para poder abrirlo con un botón
  @ViewChild('modalLogin') modalLogin!: LoginModalComponent;

  ngOnInit() {
    // Al iniciar, revisamos si ya hay un usuario guardado en el navegador
    const dato = localStorage.getItem('usuario');
    if (typeof window !== 'undefined' && window.localStorage) {
      const dato = localStorage.getItem('usuario');
      if (dato) {
        this.usuarioLogueado = JSON.parse(dato);
      }
    }
  }

  abrirLogin() {
    this.modalLogin.abrirModal();
  }

  onLoginExitoso(usuario: any) {
    this.usuarioLogueado = usuario;
  }

  onSesionCerrada() {
    this.usuarioLogueado = null;
    // Opcional: recargar la página para limpiar estados
    window.location.reload();
  }
}