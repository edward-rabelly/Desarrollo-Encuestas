import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UsuarioService, Usuario } from '../../servicios/usuario.service';

// Interfaz que combina los datos del usuario + el historial anidado que espera tu HTML
export interface UsuarioConHistorial extends Usuario {
  expandida: boolean;
  historialCargado: boolean; // Para saber si ya pedimos los datos al backend
  respuestas: any[]; // Aquí guardaremos el historial anidado
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit {
  
  // Ajustamos las columnas para que coincidan con tu HTML
  displayedColumns: string[] = ['id', 'nombre', 'email', 'fecha_registro', 'historial'];
  
  dataSource: UsuarioConHistorial[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.cargarUsuariosBasicos();
  }

  // 1. Carga solo la lista básica de usuarios (rápido)
  cargarUsuariosBasicos() {
    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        // Mapeamos los datos del backend a nuestra interfaz de UI
        this.dataSource = data.map(user => ({
          ...user,
          id: user.id_usuario, // Tu HTML usa 'id', el backend devuelve 'id_usuario'
          fecha_registro: '2026-01-01', // Dato ficticio si no está en la BD, o ajústalo
          expandida: false,
          historialCargado: false,
          respuestas: []
        }));
         this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  // 2. Lógica del botón "Ver Historial"
  toggleUsuario(usuario: UsuarioConHistorial): void {
    usuario.expandida = !usuario.expandida;

    // Si se expande Y aún no hemos cargado su historial, lo pedimos al backend
    if (usuario.expandida && !usuario.historialCargado) {
      this.cargarHistorial(usuario);
    }
  }

  // 3. Llama al nuevo endpoint del backend
  cargarHistorial(usuario: UsuarioConHistorial): void {
    this.usuarioService.getHistorialUsuario(usuario.id_usuario!).subscribe({
      next: (historial) => {
        usuario.respuestas = historial; // ¡Aquí encaja perfecto con tu HTML!
        usuario.historialCargado = true;
        console.log(`Historial cargado para ${usuario.nombre}:`, historial);
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
        usuario.respuestas = [];
        usuario.historialCargado = true;
      }
    });
  }
}
//hosting verser despliegue 