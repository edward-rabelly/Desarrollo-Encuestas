import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { LoginModalComponent } from '../../componentes/login-modal/login-modal';
import { AvatarUsuarioComponent } from '../../componentes/avatar-usuario/avatar-usuario';

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
    LoginModalComponent,
    AvatarUsuarioComponent
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

  // --- LÓGICA DE LOGIN ---
  usuarioLogueado: any = null;
  @ViewChild('modalLogin') modalLogin!: LoginModalComponent;
  
  ngOnInit() {
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
    window.location.reload();
  }
}