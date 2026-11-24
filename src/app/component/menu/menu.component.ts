import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { LoginModalComponent } from '../../componentes/login-modal/login-modal';
import { AvatarUsuarioComponent } from '../../componentes/avatar-usuario/avatar-usuario';
import { AuthService } from '../../servicios/auth.service';

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
export class MenuComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // --- LÓGICA DE LOGIN ---
  usuarioLogueado: any = null;
  @ViewChild('modalLogin') modalLogin!: LoginModalComponent;

   private suscripcion!: Subscription;
  
  ngOnInit() {
    //  NOS SUSCRIBIMOS AL SERVICIO. 
    // Cuando el AuthService emite un cambio (login o logout), esta variable se actualiza AL INSTANTE.
    this.suscripcion = this.authService.usuarioActual$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  ngOnDestroy() {
    // Limpiamos la suscripción al destruir el componente para evitar fugas de memoria
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }
  }

  abrirLogin() {
    this.modalLogin.abrirModal();
  }

  onLoginExitoso(usuario: any) {
    // La suscripción de arriba ya actualiza la variable, pero lo dejamos por compatibilidad
    this.usuarioLogueado = usuario;
  }

  onSesionCerrada() {
    //  YA NO NECESITAMOS window.location.reload()
    // El AuthService ya emitió 'null'. La suscripción de arriba detecta ese 'null',
    // actualiza 'usuarioLogueado' a null, y el *ngIf de tu HTML hace que el botón reaparezca mágicamente.
    console.log('Sesión cerrada, el botón debería reaparecer automáticamente.');
  }
}

//proyecto en blanco con angular material con los componentes, la base de datos con las variables de entorno ya llenas
//extraer unnmodelo controlador de mi proyecto que deje lista la estrucrura de un modelo 
//jostin , es un adicional 