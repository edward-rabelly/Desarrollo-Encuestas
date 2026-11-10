import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tabla } from '../../component/tabla/tabla';
import { UsuarioService } from '../../servicios/usuario.service';

import { EncuestaUsuario, EncuestaUsuarioService } from '../../servicios/encuesta-usuario';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    Tabla
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit {
  
  dataSource: any[] = [];
  isLoading = true;

  usuarioSeleccionado: any = null;
  historialData: EncuestaUsuario[] = [];
  isLoadingHistorial = false;

  constructor(
    private usuarioService: UsuarioService,
    // ✅ Usa el nombre correcto del servicio (con "Service")
    private encuestaUsuarioService: EncuestaUsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;

    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        this.dataSource = data;
        console.log('✅ Usuarios cargados:', this.dataSource);
        
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar usuarios:', error);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  verHistorial(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.isLoadingHistorial = true;
    this.historialData = [];

    this.encuestaUsuarioService.getRespuestas().subscribe({
      next: (todasLasRespuestas: EncuestaUsuario[]) => {
        this.historialData = todasLasRespuestas.filter(
          (respuesta: EncuestaUsuario) => respuesta.id_usuario == usuario.id_usuario
        );
        
        console.log(`✅ Historial de ${usuario.nombre}:`, this.historialData);
        
        setTimeout(() => {
          this.isLoadingHistorial = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar historial:', error);
        setTimeout(() => {
          this.isLoadingHistorial = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  cerrarHistorial() {
    this.usuarioSeleccionado = null;
    this.historialData = [];
  }
}