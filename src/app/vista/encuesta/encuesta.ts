import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EncuestaService, Encuesta, Pregunta, Respuesta } from '../../servicios/encuesta';


/**
 * 📝 PreguntaUI: Extendemos la interfaz base del backend.
 * ¿Por qué? Porque el backend NO sabe qué está escribiendo el usuario en este momento.
 * Agregamos 'respuestaUsuario' para guardar temporalmente lo que el usuario escribe en el input.
 * 🔗 CONEXIÓN CON HTML: Se vincula con [(ngModel)]="pregunta.respuestaUsuario"
 */
export interface PreguntaUI extends Pregunta {
  respuestaUsuario?: string;
}


/**
 * 📋 EncuestaUI: Extendemos la encuesta del backend para agregarle "estado visual".
 * El backend solo envía id, codigo y descripcion. Nosotros agregamos:
 * - expandida: para saber si el acordeón está abierto o cerrado.
 * - preguntasCargadas: para saber si ya pedimos las preguntas al servidor (evita peticiones duplicadas).
 * - preguntas: el arreglo que guardará las preguntas de esa encuesta específica.
 */
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
    FormsModule, // <-- Importante para que funcionen los inputs de texto y radio buttons
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css' // Si borraste este archivo, quita esta línea
})
export class EncuestaComponent implements OnInit {

   /**
   * 📊 displayedColumns: Define el orden y nombre de las columnas de la tabla principal.
   * 🔗 CONEXIÓN CON HTML: <ng-container *ngFor="let column of displayedColumns">
   */
  displayedColumns: string[] = [];
  
  /**
   * 📋 dataSource: Contiene la lista de encuestas con su estado visual (UI).
   * 🔗 CONEXIÓN CON HTML: <table mat-table [dataSource]="dataSource">
   */
  dataSource: EncuestaUI[] = [];

   /**
   * ⏳ isLoading: Bandera para mostrar u ocultar el spinner de carga inicial.
   * 🔗 CONEXIÓN CON HTML: <div *ngIf="isLoading"> ... <mat-spinner> ... </div>
   */
  isLoading = true;

  constructor(private encuestaService: EncuestaService, private cdr: ChangeDetectorRef) {}// Para forzar la actualización de la vista cuando cambian los datos
  
  ngOnInit() {
    this.cargarEncuestas();// Al iniciar el componente, traemos las encuestas
  }


   /**
   * cargarEncuestas(): Obtiene la lista de encuestas del backend.
   * Usa .map() para transformar los datos puros del backend en objetos EncuestaUI, 
   * agregándoles las propiedades de estado visual (expandida: false, preguntas: [], etc.).
   */
  cargarEncuestas() {
    this.isLoading = true;
    this.encuestaService.getEncuestas().subscribe({
      next: (data) => { 
        this.dataSource = data.map(encuesta => ({
          ...encuesta,// Copia los datos del backend (id_encuesta, codigo, descripcion)
          idEncuesta: encuesta.id_encuesta,
          expandida: false, // Por defecto, cerrada
          preguntasCargadas: false, // Por defecto, sin preguntas cargadas
          preguntas: [] // Arreglo vacío inicial
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


  /**
   * toggleEncuesta(): Abre o cierra el formulario de una encuesta específica.
   * 🔗 CONEXIÓN CON HTML: (click)="toggleEncuesta(element)" en el botón "Realizar Encuesta"
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
        console.error('Error cargando preguntas:', err);
        encuesta.preguntas = [];
        encuesta.preguntasCargadas = true;
        this.cdr.detectChanges();
      }
    });
  }

  
  /**
   * enviarRespuestas(): Valida y envía las respuestas al backend.
   * 🔗 CONEXIÓN CON HTML: (click)="enviarRespuestas(encuesta)" en el botón "Enviar Respuestas"
   */
  enviarRespuestas(encuesta: EncuestaUI): void {
    // 1. Validación: Filtra las preguntas que están vacías o solo tienen espacios
    const preguntasSinRespuesta = encuesta.preguntas.filter(p => !p.respuestaUsuario || p.respuestaUsuario.trim() === ''); 
    
    if (preguntasSinRespuesta.length > 0) {
      alert(`⚠️ Por favor responde todas las preguntas. Faltan ${preguntasSinRespuesta.length} por responder.`);
      return;// Detiene la ejecución si faltan respuestas
    }

    // 2. ✅ AUTENTICACIÓN: Obtenemos el ID REAL del usuario desde el localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    const idUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado).id_usuario : null;

    if (!idUsuario) {
      alert('❌ Error: No hay un usuario logueado. Por favor inicia sesión primero.');
      return;
    }

    console.log(' Enviando respuestas con ID de usuario real:', idUsuario);

    let respuestasEnviadas = 0;
    const totalRespuestas = encuesta.preguntas.length;

    // 3. Bucle para enviar cada respuesta individualmente al backend
    encuesta.preguntas.forEach(pregunta => {
      const respuestaData: Respuesta = {
        id_usuario: idUsuario, // <-- Ahora usa el ID real del usuario logueado
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