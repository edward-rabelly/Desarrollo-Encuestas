import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EncuestaService, Encuesta, Pregunta, Respuesta } from '../../servicios/encuesta';

// Extendemos Pregunta para guardar la respuesta temporal del usuario en el frontend
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
    FormsModule, // <-- Importante para los inputs
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css' // Si borraste este archivo, quita esta línea
})
export class EncuestaComponent implements OnInit {
  displayedColumns: string[] = ['idEncuesta', 'codigo', 'descripcion', 'participar'];
  dataSource: EncuestaUI[] = [];
  isLoading = true;

  constructor(private encuestaService: EncuestaService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarEncuestas();
  }

  cargarEncuestas() {
    this.isLoading = true;
    this.encuestaService.getEncuestas().subscribe({
      next: (data) => {
        this.dataSource = data.map(encuesta => ({
          ...encuesta,
          idEncuesta: encuesta.id_encuesta,
          expandida: false,
          preguntasCargadas: false,
          preguntas: []
        }));
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

  // ✅ MÉTODO PARA ENVIAR LAS RESPUESTAS AL BACKEND
  enviarRespuestas(encuesta: EncuestaUI): void {
    // 1. Validar que todas las preguntas tengan respuesta
    const preguntasSinRespuesta = encuesta.preguntas.filter(p => !p.respuestaUsuario || p.respuestaUsuario.trim() === '');
    
    if (preguntasSinRespuesta.length > 0) {
      alert(`⚠️ Por favor responde todas las preguntas. Faltan ${preguntasSinRespuesta.length} por responder.`);
      return;
    }

    // 2. ID de usuario (Hardcodeado a 1 por ahora, luego se toma del login)
    const idUsuario = 1; 
    let respuestasEnviadas = 0;
    const totalRespuestas = encuesta.preguntas.length;

    // 3. Enviar cada respuesta al backend
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
            encuesta.expandida = false; // Colapsar la encuesta
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