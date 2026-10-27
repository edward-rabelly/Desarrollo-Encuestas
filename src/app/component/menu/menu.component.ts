import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true, // Indica que es un Componente Standalone (no requiere NgModule)
  imports: [
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  // Inyectamos el servicio de Angular CDK para observar los cambios de tamaño de pantalla
  private breakpointObserver = inject(BreakpointObserver);
  
  /**
   * Observable que detecta si el dispositivo es un "Handset" (celular o tablet pequeña).
   * Utiliza programación reactiva (RxJS) para emitir true o false en tiempo real.
   */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      // Transforma el resultado complejo en un simple booleano (true si es móvil, false si es PC)
      map(result => result.matches),
      // Optimización: Comparte la última emisión con nuevos suscriptores para evitar múltiples observaciones
      shareReplay()
    );
}