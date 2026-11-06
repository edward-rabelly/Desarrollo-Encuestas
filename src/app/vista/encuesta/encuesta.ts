import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EncuestaService, Encuesta, Pregunta, Respuesta } from '../../servicios/encuesta';

export interface PreguntaUI extends Pregunta {
  respuestaUsuario?: string;
}

export interface EncuestaUI extends Encuesta {
  idEncuesta?: number;
  expandida: boolean;
  preguntasCargadas: boolean;
  preguntas: PreguntaUI[];
}

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css'
})
export class EncuestaComponent implements OnInit {
  
  // ✅ 1. Columnas DINÁMICAS (inician vacías, se llenan solas con lo que viene del backend)
  displayedColumns: string[] = [];
  
  // 2. Datos con estado visual (UI)
  dataSource: EncuestaUI[] = [];
  
  // 3. Spinner de carga inicial
  isLoading = true;

  constructor(private encuestaService: EncuestaService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarEncuestas();
  }

  /**
   * cargarEncuestas(): Obtiene las encuestas del backend y genera las columnas dinámicamente.
   */
  cargarEncuestas() {
    this.isLoading = true;
    this.encuestaService.getEncuestas().subscribe({
      next: (data) => {
        // Transformamos los datos puros del backend en objetos EncuestaUI
        this.dataSource = data.map(encuesta => ({
          ...encuesta,
          idEncuesta: encuesta.id_encuesta,
          expandida: false,
          preguntasCargadas: false,
          preguntas: []
        }));

        // 🚀 MAGIA: Generar columnas automáticamente desde el primer registro
        if (this.dataSource.length > 0) {
          this.displayedColumns = Object.keys(this.dataSource[0]).filter(key => 
            // Filtramos las propiedades que NO son de la base de datos (son solo para la UI)
            key !== 'expandida' && 
            key !== 'preguntasCargadas' && 
            key !== 'preguntas'
          );
          // Agregamos la columna de acción al final
          this.displayedColumns.push('participar');
          
          console.log('📊 Columnas detectadas dinámicamente:', this.displayedColumns);
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando encuestas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEncuesta(encuesta: EncuestaUI): void {
    encuesta.expandida = !encuesta.expandida;
    if (encuesta.expandida && !encuesta.preguntasCargadas && encuesta.id_encuesta) {
      this.cargarPreguntas(encuesta);
    }
  }

  cargarPreguntas(encuesta: EncuestaUI): void {
    this.encuestaService.getPreguntasPorEncuesta(encuesta.id_encuesta!).subscribe({
      next: (preguntas) => {
        encuesta.preguntas = preguntas.map(p => ({ ...p, respuestaUsuario: '' }));
        encuesta.preguntasCargadas = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando preguntas:', err);
        encuesta.preguntas = [];
        encuesta.preguntasCargadas = true;
        this.cdr.detectChanges();
      }
    });
  }

  enviarRespuestas(encuesta: EncuestaUI): void {
    const preguntasSinRespuesta = encuesta.preguntas.filter(p => !p.respuestaUsuario || p.respuestaUsuario.trim() === '');
    
    if (preguntasSinRespuesta.length > 0) {
      alert(`⚠️ Por favor responde todas las preguntas. Faltan ${preguntasSinRespuesta.length} por responder.`);
      return;
    }

    const usuarioGuardado = localStorage.getItem('usuario');
    const idUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado).id_usuario : null;

    if (!idUsuario) {
      alert('❌ Error: No hay un usuario logueado. Por favor inicia sesión primero.');
      return;
    }

    console.log('👤 Enviando respuestas con ID de usuario real:', idUsuario);

    let respuestasEnviadas = 0;
    const totalRespuestas = encuesta.preguntas.length;

    encuesta.preguntas.forEach(pregunta => {
      const respuestaData: Respuesta = {
        id_usuario: idUsuario,
        id_encuesta: encuesta.id_encuesta!,
        id_pregunta: pregunta.id_pregunta!,
        respuesta: pregunta.respuestaUsuario!
      };

      this.encuestaService.crearRespuesta(respuestaData).subscribe({
        next: () => {
          respuestasEnviadas++;
          if (respuestasEnviadas === totalRespuestas) {
            alert('✅ ¡Respuestas enviadas exitosamente a la base de datos!');
            encuesta.expandida = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('❌ Error enviando respuesta:', err);
          alert('Error al enviar las respuestas. Revisa la consola.');
        }
      });
    });
  }
}