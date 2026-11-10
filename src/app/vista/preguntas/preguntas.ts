import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Tabla } from '../../component/tabla/tabla';

import { Preguntas, Pregunta } from '../../servicios/preguntas';
// ✅ Importamos la interfaz (datos) y el servicio (clase con "Service")
import { EncuestaUsuario, EncuestaUsuarioService } from '../../servicios/encuesta-usuario';

interface PreguntaConRespuesta extends Pregunta {
  respuesta: string;
}

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatProgressSpinnerModule, 
    MatButtonModule, 
    MatRadioModule, 
    Tabla
  ],
  templateUrl: './preguntas.html',
  styleUrl: './preguntas.css'
})
export class PreguntasComponent implements OnInit {
  
  // --- MODO 1: Ver todas las preguntas (Tabla dinámica) ---
  dataSource: Pregunta[] = [];
  isLoading = true;

  // --- MODO 2: Responder una encuesta (Formulario) ---
  modoRespuesta = false;
  idEncuestaActual: number | null = null;
  preguntasRespuesta: PreguntaConRespuesta[] = [];
  isLoadingPreguntas = false;
  enviandoRespuestas = false;

  constructor(
    private preguntasService: Preguntas,
    private encuestaUsuarioService: EncuestaUsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Leemos si viene un ID en la URL (ej: /preguntas/1)
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // MODO RESPUESTA: Viene de hacer clic en "Realizar Encuesta"
      this.modoRespuesta = true;
      this.idEncuestaActual = Number(id);
      this.cargarPreguntasParaRespuesta(this.idEncuestaActual);
    } else {
      // MODO LISTA: Entró directamente a /preguntas
      this.modoRespuesta = false;
      this.cargarTodasLasPreguntas();
    }
  }

  cargarTodasLasPreguntas() {
    this.isLoading = true;
    this.preguntasService.getPreguntas().subscribe({
      next: (data) => {
        this.dataSource = data;
        setTimeout(() => { this.isLoading = false; this.cdr.detectChanges(); }, 0);
      },
      error: (error) => {
        console.error('Error:', error);
        setTimeout(() => { this.isLoading = false; this.cdr.detectChanges(); }, 0);
      }
    });
  }

  cargarPreguntasParaRespuesta(idEncuesta: number) {
    this.isLoadingPreguntas = true;
    this.preguntasService.getPreguntasPorEncuesta(idEncuesta).subscribe({
      next: (data) => {
        this.preguntasRespuesta = data.map(p => ({ ...p, respuesta: '' }));
        setTimeout(() => { this.isLoadingPreguntas = false; this.cdr.detectChanges(); }, 0);
      },
      error: (error) => {
        console.error('Error al cargar preguntas:', error);
        setTimeout(() => { this.isLoadingPreguntas = false; this.cdr.detectChanges(); }, 0);
      }
    });
  }

  enviarRespuestas() {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (!usuarioGuardado) {
      alert('Debes iniciar sesión para responder una encuesta.');
      this.router.navigate(['/']); 
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    const idUsuarioDinamico = usuario.id_usuario;

    this.enviandoRespuestas = true;

    // ✅ Usamos '!' para asegurar a TypeScript que no son null en este punto
    const respuestas: EncuestaUsuario[] = this.preguntasRespuesta.map(p => ({
      id_usuario: idUsuarioDinamico,
      id_encuesta: this.idEncuestaActual!,   
      id_pregunta: p.id_pregunta!,           
      respuesta: p.respuesta
    }));

    const promesas = respuestas.map(r => this.encuestaUsuarioService.crearRespuesta(r).toPromise());

    Promise.all(promesas).then(() => {
      alert('✅ Encuesta enviada correctamente');
      this.router.navigate(['/encuesta']); // Volvemos a la lista de encuestas
    }).catch(error => {
      console.error('Error al enviar:', error);
      alert('❌ Error al enviar la encuesta');
      this.enviandoRespuestas = false;
      this.cdr.detectChanges();
    });
  }

  cancelarRespuesta() {
    this.router.navigate(['/encuesta']);
  }
}