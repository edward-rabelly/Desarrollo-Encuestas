import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EncuestaService, Encuesta, Pregunta, Respuesta } from '../../servicios/encuesta';

// ============================================
// 1. INTERFACES DE USUARIO (UI)
// ============================================

/**
 * 📝 PreguntaUI: Extendemos la interfaz del backend.
 * Agregamos 'respuestaUsuario' para capturar lo que el usuario escribe en el input.
 * 🔗 CONEXIÓN HTML: [(ngModel)]="pregunta.respuestaUsuario"
 */
export interface PreguntaUI extends Pregunta {
  respuestaUsuario?: string;
}

/**
 * 📋 EncuestaUI: Extendemos la encuesta para agregarle "estado visual".
 * El backend solo envía id, codigo y descripcion. Nosotros agregamos propiedades 
 * para controlar la interfaz (si está abierta, si ya cargó preguntas, etc.).
 */
export interface EncuestaUI extends Encuesta {
  idEncuesta?: number;
  expandida: boolean;
  preguntasCargadas: boolean;
  preguntas: PreguntaUI[];
}

// ============================================
// 2. COMPONENTE
// ============================================
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
  
  // ✅ 2. Datos con estado visual (UI)
  dataSource: EncuestaUI[] = [];
  
  // ✅ 3. Spinner de carga inicial
  isLoading = true;

  constructor(
    private encuestaService: EncuestaService, 
    private cdr: ChangeDetectorRef // Para forzar la actualización de la vista
  ) {}

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
        // 1. Transformamos los datos puros del backend en objetos EncuestaUI
        this.dataSource = data.map(encuesta => ({
          ...encuesta, // Copia: id_encuesta, codigo, descripcion
          idEncuesta: encuesta.id_encuesta, // Normalizamos el nombre
          expandida: false,                 // Por defecto, formulario cerrado
          preguntasCargadas: false,         // Por defecto, sin preguntas cargadas
          preguntas: []                     // Arreglo vacío inicial
        }));

        // 2. 🚀 MAGIA: Generar columnas automáticamente desde el primer registro
        if (this.dataSource.length > 0) {
          this.displayedColumns = Object.keys(this.dataSource[0]).filter(key => 
            key !== 'expandida' &&          // Filtramos propiedades de la UI
            key !== 'preguntasCargadas' &&  // Filtramos propiedades de la UI
            key !== 'preguntas' &&          // Filtramos propiedades de la UI
            key !== 'id_encuesta'           // Filtramos el ID original para no duplicar con 'idEncuesta'
          );
          
          // Agregamos manualmente la columna de acción al final
          this.displayedColumns.push('participar');
          
          console.log('📊 Columnas detectadas dinámicamente:', this.displayedColumns);
        }

        // 3. Ocultamos el spinner y actualizamos la vista
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error cargando encuestas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * toggleEncuesta(): Abre o cierra el formulario de una encuesta específica.
   * 🔗 CONEXIÓN HTML: (click)="toggleEncuesta(element)"
   * 
   * Lógica inteligente (Lazy Loading): Solo llama a cargarPreguntas() si se está abriendo 
   * Y ADEMÁS las preguntas no se han cargado antes. ¡Ahorra tráfico de red!
   */
  toggleEncuesta(encuesta: EncuestaUI): void {
    encuesta.expandida = !encuesta.expandida; // Invierte el estado (true <-> false)
    
    if (encuesta.expandida && !encuesta.preguntasCargadas && encuesta.id_encuesta) {
      this.cargarPreguntas(encuesta);
    }
  }

  /**
   * cargarPreguntas(): Pide al backend las preguntas de una encuesta específica.
   * Al recibirlas, les agrega la propiedad 'respuestaUsuario: ""' para que el input del HTML tenga donde guardar el texto.
   */
  cargarPreguntas(encuesta: EncuestaUI): void {
    this.encuestaService.getPreguntasPorEncuesta(encuesta.id_encuesta!).subscribe({
      next: (preguntas) => {
        encuesta.preguntas = preguntas.map(p => ({ ...p, respuestaUsuario: '' }));
        encuesta.preguntasCargadas = true; // Marcamos como cargadas para no volver a pedirlo
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error cargando preguntas:', err);
        encuesta.preguntas = [];
        encuesta.preguntasCargadas = true;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * enviarRespuestas(): Valida y envía las respuestas al backend.
   * 🔗 CONEXIÓN HTML: (click)="enviarRespuestas(encuesta)"
   */
  enviarRespuestas(encuesta: EncuestaUI): void {
    // 1. Validación: Filtra las preguntas que están vacías o solo tienen espacios
    const preguntasSinRespuesta = encuesta.preguntas.filter(p => !p.respuestaUsuario || p.respuestaUsuario.trim() === '');
    
    if (preguntasSinRespuesta.length > 0) {
      alert(`⚠️ Por favor responde todas las preguntas. Faltan ${preguntasSinRespuesta.length} por responder.`);
      return; // Detiene la ejecución si faltan respuestas
    }

    // 2. ✅ AUTENTICACIÓN: Obtenemos el ID REAL del usuario desde el localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    const idUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado).id_usuario : null;

    if (!idUsuario) {
      alert('❌ Error: No hay un usuario logueado. Por favor inicia sesión primero.');
      return;
    }

    console.log('👤 Enviando respuestas con ID de usuario real:', idUsuario);

    let respuestasEnviadas = 0;
    const totalRespuestas = encuesta.preguntas.length;

    // 3. Bucle para enviar cada respuesta individualmente al backend
    encuesta.preguntas.forEach(pregunta => {
      const respuestaData: Respuesta = {
        id_usuario: idUsuario, 
        id_encuesta: encuesta.id_encuesta!,
        id_pregunta: pregunta.id_pregunta!,
        respuesta: pregunta.respuestaUsuario! // Toma el valor que el usuario escribió en el [(ngModel)]
      };

      this.encuestaService.crearRespuesta(respuestaData).subscribe({
        next: () => {
          respuestasEnviadas++;
          // Cuando el contador de enviadas iguala al total, significa que todo salió bien
          if (respuestasEnviadas === totalRespuestas) {
            alert('✅ ¡Respuestas enviadas exitosamente a la base de datos!');
            encuesta.expandida = false; // Cierra el formulario automáticamente
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