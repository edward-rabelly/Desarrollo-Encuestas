import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css'
})
export class Tabla implements OnChanges {

  @Input() data: any[] = [];
  @Input() mostrarBoton = false;
  displayColumns: string[] = [];

  @Output() filaSeleccionada = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.generarColumnas();
    }
  }

  private generarColumnas(): void {
    this.displayColumns = [];
    this.data.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (!this.displayColumns.includes(key)) {
          this.displayColumns.push(key);
        }
      });
    });

    if (this.mostrarBoton) {
      this.displayColumns.push('accion');
    }
  }

  onRowClick(element: any): void {
    this.filaSeleccionada.emit(element);
  }
}