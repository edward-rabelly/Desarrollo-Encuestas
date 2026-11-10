import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tabla } from '../../component/tabla/tabla';
import {  EncuestaUsuarioService } from '../../servicios/encuesta-usuario';


@Component({
  selector: 'app-encuesta-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    Tabla
  ],
  templateUrl: './encuesta-usuario.html',
  styleUrl: './encuesta-usuario.css'
})
export class EncuestaUsuarioComponent implements OnInit {
  
  dataSource: any[] = [];
  isLoading = true;

  constructor(
    // private encuestaUsuarioService: EncuestaUsuarioService, // Se descomenta al crear el servicio
    private cdr: ChangeDetectorRef,
    private encuestaUsuarioService: EncuestaUsuarioService ,
  ) {}

  ngOnInit() {
    this.cargarEncuestaUsuario();
  }

  cargarEncuestaUsuario() {
    this.isLoading = true;

    // ✅ Llamada REAL al backend
    this.encuestaUsuarioService.getRespuestas().subscribe({
      next: (data) => {
        this.dataSource = data;
        console.log('✅ Respuestas cargadas desde el backend:', this.dataSource);

        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        console.error('❌ Error al cargar respuestas:', error);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
}