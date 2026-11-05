import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit {
  
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  
  expandedRows = new Set<number>();
  loadedHistory = new Set<number>();
  historyData: { [key: number]: any[] } = {};

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        this.dataSource = data;
        
        if (data && data.length > 0) {
          this.displayedColumns = Object.keys(data[0]).filter(key => 
            key !== 'contrasena' && key !== 'password'
          );
          this.displayedColumns.push('acciones');
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  toggleUsuario(usuario: any): void {
    const id = usuario.id_usuario;
    
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
    } else {
      this.expandedRows.add(id);
      if (!this.loadedHistory.has(id)) {
        this.cargarHistorial(usuario);
      }
    }
  }

  cargarHistorial(usuario: any) {
    this.usuarioService.getHistorialUsuario(usuario.id_usuario).subscribe({
      next: (historial) => {
        this.historyData[usuario.id_usuario] = historial;
        this.loadedHistory.add(usuario.id_usuario);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
        this.historyData[usuario.id_usuario] = [];
        this.loadedHistory.add(usuario.id_usuario);
      }
    });
  }

  isExpanded(id: number): boolean {
    return this.expandedRows.has(id);
  }

  getHistorial(id: number): any[] {
    return this.historyData[id] || [];
  }
}
//hosting verser despliegue 

// actualizar las tablas a una generica 
//Input () data: any[] = []; imdasput quiere decir que traiga algo, el any quiere decir cualquiera pero debe tener una estructura
//arreglo con todas las columnas y los datos
// displayedcolumns, va algo dentro this.data foreach es uno por uno push es incertar informacion
// ng for ="let colum oasdasadf displayedcolumns" es para colcocar tantas columnas como sea posible con el titulo td 
// va desde ts a html 
