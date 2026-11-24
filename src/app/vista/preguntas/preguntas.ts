import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Tabla } from '../../component/tabla/tabla';

import { Preguntas, Pregunta } from '../../servicios/preguntas';
//  Importamos la interfaz (datos) y el servicio (clase con "Service")
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

  //spiner
  isLoading = true;

  // --- MODO 2: Responder una encuesta (Formulario), es la parte del inicio
  modoRespuesta = false;
  //esto no dcie que  oculta el id si no que nadie a escogido esa pregunta con ese id
  idEncuestaActual: number | null = null;
  // las preguntas tienen una data traiga esa data
  preguntasRespuesta: PreguntaConRespuesta[] = [];
  //nadiea  oprimido ese boton por eso esta en false
  isLoadingPreguntas = false;
  // nadie a respondido ninguna encuesta por eso false
  enviandoRespuestas = false;

  constructor(
    private preguntasService: Preguntas,
    private encuestaUsuarioService: EncuestaUsuarioService,
    private route: ActivatedRoute, // solo lee la url y en este caso es de las preguntas
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Leemos si viene un ID en la URL (ej: /preguntas/1)
    // el this.route activa activateroute
    //snapshot es para una intantania de la url 
    // paramap busca el parametro que tiene esa url 
    // y get que dentro de esa url hay algo exacto que es la /1
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
    //aqui iniciamos con el hecho de que si esta logueado o no 
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (!usuarioGuardado) {
      alert('Debes iniciar sesión para responder una encuesta.');
      this.router.navigate(['/']); 
      return;
    }
    
    //esta linea dice que 
    const usuario = JSON.parse(usuarioGuardado);

   // esat desglosa el mensaje
    const idUsuarioDinamico = usuario.id_usuario;
   
    //aqui decimos que esa data lo envie con las respeustas
    this.enviandoRespuestas = true;
    
   // es una estrucura de datos dinamicos, osea envie la repuesta a encuestausuario pero que lo desglose de esa manera
    const respuestas: EncuestaUsuario[] = this.preguntasRespuesta.map(p => ({
      id_usuario: idUsuarioDinamico,
      id_encuesta: this.idEncuestaActual!,   
      id_pregunta: p.id_pregunta!,           
      respuesta: p.respuesta
    }));
    
    //esto es para enviar varias respuestas al mismo tiempo, el topromise es un traductor, nativa de java script, 
    //envia todo el paquete separado
    const promesas = respuestas.map(r => this.encuestaUsuarioService.crearRespuesta(r).toPromise());

    
    //aqui e sapra confirmar que los paquetes se hayan enviado
    Promise.all(promesas). 

     //si todo sale bien que se envien
       then(() => {
      alert(' Encuesta enviada correctamente');
      this.router.navigate(['/encuesta']); // Volvemos a la lista de encuestas
    }).catch(error => {
      console.error('Error al enviar:', error);
      alert(' Error al enviar la encuesta');
      this.enviandoRespuestas = false;
      this.cdr.detectChanges();
    });
  }
  

  // me envia a la ruta de encuestas
  cancelarRespuesta() {
    this.router.navigate(['/encuesta']);
  }
}