import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css'
})
export class Tabla implements OnChanges {

  @Input() data: any[] = [];
  @Input() mostrarBoton = false;
  @Input() textoBoton = 'Ver';
  @Input() tituloColumnaAccion = 'Acción';

  @Output() filaSeleccionada = new EventEmitter<any>();

  displayColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length > 0) {
      // 👇 Detecta automáticamente las columnas del primer objeto
      this.displayColumns = Object.keys(this.data[0]);
      
      if (this.mostrarBoton) {
        this.displayColumns.push('accion');
      }
    }
  }

  onRowClick(element: any) {
    this.filaSeleccionada.emit(element);
  }
}