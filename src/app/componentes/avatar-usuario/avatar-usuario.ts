import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-usuario.component.html',
  styleUrls: ['./avatar-usuario.component.css']
})
export class AvatarUsuarioComponent implements OnInit {
  @Output() sesionCerrada = new EventEmitter<void>();
  
  usuario: any = null;
  iniciales = 'U';
  colorAvatar = '#4dd0e1';

  ngOnInit() { this.cargarUsuario(); }

  cargarUsuario() {
    const dato = localStorage.getItem('usuario');
    if (dato) {
      this.usuario = JSON.parse(dato);
      this.generarIniciales();
    }
  }

  generarIniciales() {
    if (this.usuario && this.usuario.nombre) {
      const partes = this.usuario.nombre.trim().split(' ');
      const inicial1 = partes[0]?.charAt(0).toUpperCase() || '';
      const inicial2 = partes.length > 1 ? partes[1]?.charAt(0).toUpperCase() : '';
      this.iniciales = inicial1 + inicial2;
      
      // Colores predefinidos elegantes
      const colores = ['#4dd0e1', '#ff7043', '#66bb6a', '#ab47bc', '#ffa726', '#29b6f6', '#ef5350'];
      const indice = this.usuario.nombre.charCodeAt(0) % colores.length;
      this.colorAvatar = colores[indice];
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.sesionCerrada.emit();
  }
}