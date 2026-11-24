import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Encuesta, EncuestaService} from '../../servicios/encuesta';
import { Tabla } from '../../component/tabla/tabla';



@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatProgressSpinnerModule,
    Tabla
  ],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css'
})

// aqui decimos que use de priemra lo que haya en el oninit
export class EncuestaComponent implements OnInit {
  
  //Es la lista que le dice a la tabla de Material qué columnas pintar y en qué orden.
  displayedColumns: string[] = [];
  //  2. Datos con estado visual (UI)
  dataSource: Encuesta[] = [];
  
  
  //  3. Spinner de carga inicial
  isLoading = true;


  //herramientas que puede usar esata vista
  constructor(
    private encuestaService: EncuestaService, 
    private router: Router,
    private cdr: ChangeDetectorRef // Para forzar la actualización de la vista
  ) {}
  

  //inicia cargando las encuestas o este metodo
  ngOnInit() {
    this.cargarEncuestas();
  }

  cargarEncuestas() {

    

    // le pide al servicio(encuestaservice) traiga todas las encuestas (getencuestas) y espere (susbscribe)

  this.encuestaService.getEncuestas().subscribe({
    next: (data) => {
      // Asignamos los datos recibidos del backend a la variable local
      this.dataSource=data

      //primero termina de dibujar este spiner para luego mostrar la data
      setTimeout(() => {
        //si o si apague el spiner
        this.isLoading = false;
        // obligatoriamente muestre los datos
        this.cdr.detectChanges();
        }, 0);
      },

      // si no trae nada muestre este error
      error: (error) => {
      console.error('Error al cargar las encuestas:', error);
      setTimeout(() => {
        this.isLoading = false,
        this.cdr.detectChanges();
      },0);
    }
    }); 
  } 

  // esto no es como tal una peticion al backend si no uan parte que dice vaya a preguntas y cambie de vista
  realizarEncuesta(encuesta: Encuesta) {
    this.router.navigate(['/preguntas', encuesta.id_encuesta]);
  }
  }


