import { Component, OnInit } from '@angular/core';
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
  
  // 1. Columnas dinámicas (se llenan solas)
  displayedColumns: string[] = [];
  
  // 2. Datos PUROS del backend (sin agregarle propiedades falsas)
  dataSource: any[] = [];
  
  // 3. Estado de la UI separado de los datos (¡La forma profesional!)
  expandedRows = new Set<number>();       // Guarda los IDs de las filas abiertas
  loadedHistory = new Set<number>();      // Guarda los IDs que ya cargaron su historial
  historyData: { [key: number]: any[] } = {}; // Guarda el historial por ID de usuario

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        // Asignamos los datos puros, tal cual vienen de la BD
        this.dataSource = data;
        
        // 🚀 MAGIA: Extraer columnas automáticamente del primer registro
        if (data && data.length > 0) {
          this.displayedColumns = Object.keys(data[0]).filter(key => 
            key !== 'contrasena' && key !== 'password' // Filtramos solo lo sensible
          );
          // Agregamos la columna de acciones al final para el botón
          this.displayedColumns.push('acciones');
        }
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  // Alternar la fila (abrir/cerrar) usando el ID, sin tocar el objeto de datos
  toggleUsuario(usuario: any): void {
    const id = usuario.id_usuario;
    
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id); // Cerrar
    } else {
      this.expandedRows.add(id);    // Abrir
      
      // Si es la primera vez que se abre, cargamos el historial
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
      },
      error: (err) => console.error('Error cargando historial:', err)
    });
  }

  // Helpers para el HTML
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
