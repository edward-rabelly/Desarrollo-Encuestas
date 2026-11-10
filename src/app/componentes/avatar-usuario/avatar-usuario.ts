import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

// 👇 Imports de Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-avatar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,    // 👈 Para el menú desplegable
    MatIconModule,    // 👈 Para los íconos
    MatButtonModule,  // 👈 Para los botones
    MatDividerModule  // 👈 Para la línea separadora
  ],
  templateUrl: './avatar-usuario.html',
  styleUrl: './avatar-usuario.css'
})
export class AvatarUsuarioComponent implements OnInit {
  
  usuario: any = null;
  iniciales = '';
  colorIndex = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuario = this.authService.getUsuarioActual();
    
    if (this.usuario) {
      this.iniciales = this.generarIniciales(this.usuario.nombre);
      this.colorIndex = this.generarIndiceColor(this.usuario.nombre);
    }
  }

  private generarIniciales(nombre: string): string {
    if (!nombre) return '?';
    const partes = nombre.split(' ');
    return partes.length >= 2 
      ? (partes[0][0] + partes[1][0]).toUpperCase() 
      : nombre.substring(0, 2).toUpperCase();
  }

  private generarIndiceColor(texto: string): number {
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
      hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 10;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuario = null;
    this.router.navigate(['/']);
  }
}