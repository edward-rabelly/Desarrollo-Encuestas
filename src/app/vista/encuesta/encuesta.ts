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


export class EncuestaComponent implements OnInit {

  displayedColumns: string[] = [];
  //  2. Datos con estado visual (UI)
  dataSource: Encuesta[] = [];
  
  
  //  3. Spinner de carga inicial
  isLoading = true;

  constructor(
    private encuestaService: EncuestaService, 
    private router: Router,
    private cdr: ChangeDetectorRef // Para forzar la actualización de la vista
  ) {}

  ngOnInit() {
    this.cargarEncuestas();
  }

  cargarEncuestas() {
  

  this.encuestaService.getEncuestas().subscribe({
    next: (data) => {
      // Asignamos los datos recibidos del backend a la variable local
      this.dataSource=data
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
      console.error('Error al cargar las encuestas:', error);
      setTimeout(() => {
        this.isLoading = false,
        this.cdr.detectChanges();
      },0);
    }
    }); // <--- AQUÍ SE CIERRA EL SUBSCRIBE
  } 
  realizarEncuesta(encuesta: Encuesta) {
    this.router.navigate(['/preguntas', encuesta.id_encuesta]);
  }
  }


