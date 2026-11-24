import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css'
})
export class Tabla implements OnChanges {
  
  @Input() data: any[] = [];
  @Input() columnas: string[] = []; // 👈 El padre SIEMPRE debe pasar las columnas
  @Input() mostrarBoton = false;
  @Input() textoBoton = 'Ver';
  @Input() tituloColumnaAccion = 'Acción';
  
  @Output() verHistorial = new EventEmitter<any>();

  displayColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.actualizarColumnas();
  }

  private actualizarColumnas() {
    // 👇 Si el padre no pasa columnas, mostrar array vacío (tabla vacía)
    // Nunca hardcodeamos columnas específicas
    this.displayColumns = this.mostrarBoton 
      ? [...this.columnas, 'accion'] 
      : [...this.columnas];
  }

  onRowClick(element: any) {
    this.verHistorial.emit(element);
  }
}