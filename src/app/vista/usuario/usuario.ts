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
  

  //displayedColumns: Arreglo con los nombres de las columnas que se mostrarán en la tabla.//
  displayedColumns: string[] = [];

  //: Arreglo con los datos puros de los usuarios que vienen del backend.//
   //CONEXIÓN CON HTML: Se vincula a la tabla con [dataSource]="dataSource".//
  dataSource: any[] = [];
  
  //(Set) que guarda los IDs de los usuarios cuya fila está EXPANDIDA (abierta).//
   //*  CONEXIÓN CON HTML: Se usa en *ngIf para mostrar/ocultar el historial y en el ícono de la flecha.//
  expandedRows = new Set<number>();


  //Conjunto (Set) que guarda los IDs de los usuarios cuyo historial YA fue cargado.//
   //Sirve para NO volver a pedir el historial al backend si el usuario ya lo abrió una vez (eficiencia).//
   
  loadedHistory = new Set<number>();

  //Objeto que almacena el historial de encuestas de cada usuario, indexado por su ID.//
  //Estructura: { 1: [historial_usuario_1], 7: [historial_usuario_7], ... }//
  historyData: { [key: number]: any[] } = {};

  constructor(
    private usuarioService: UsuarioService, // Servicio para hacer peticiones al backend
    private cdr: ChangeDetectorRef // Servicio para forzar la detección de cambios de Angular
  ) {}




  //ngOnInit: Se ejecuta automáticamente cuando el componente se inicializa (al cargar la página).
  //Aquí llamamos a cargarUsuarios() para traer los datos del backend inmediatamente.
  ngOnInit() {
    this.cargarUsuarios();
  }
   
  // cargarUsuarios(): Hace una petición GET al backend para obtener todos los usuarios.
  // Las columnas se generan dinámicamente con Object.keys() y se guardan en `displayedColumns`,
  // que el *ngFor del HTML recorre para crear cada columna.
  cargarUsuarios() {
    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        this.dataSource = data; // Guardamos los datos puros del backend
        
        //Extraemos los nombres de las columnas automáticamente del primer usuario
        if (data && data.length > 0) {
          this.displayedColumns = Object.keys(data[0]).filter(key => 
            key !== 'contrasena' && key !== 'password'
          );
          this.displayedColumns.push('acciones'); // Agregamos la columna especial del botón
        }

        // Forzamos a Angular a detectar los cambios (evita errores de renderizado)
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }


   /**
   * toggleUsuario(usuario): Abre o cierra el historial de un usuario específico.
   * Se llama cuando el usuario hace clic en el botón de la flecha (▼/▲).
   * 
   * 🔗 CONEXIÓN CON HTML:
   * - Se invoca desde el botón: (click)="toggleUsuario(element)"
   * - Modifica el Set `expandedRows`, lo que hace que isExpanded() cambie de valor
   *   y el HTML muestre/oculte el historial automáticamente.
   */
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



  
  /**
   * cargarHistorial(usuario): Hace una petición GET al backend para obtener las encuestas
   * respondidas por un usuario específico.
   * 
   * 🔗 CONEXIÓN CON HTML:
   * - Los datos se guardan en `historyData[id_usuario]`, que el HTML recorre con *ngFor.
   * - Se marca el ID en `loadedHistory` para que el HTML sepa que ya no debe mostrar el spinner.
   */
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


  /**
   * isExpanded(id): Devuelve true si la fila del usuario con ese ID está expandida (abierta).
   * 
   * 🔗 CONEXIÓN CON HTML:
   * - Se usa en *ngIf para mostrar/ocultar el bloque del historial:
   *   *ngIf="isExpanded(element.id_usuario)"
   * - Se usa en el ícono para cambiar entre flecha arriba/abajo:
   *   {{ isExpanded(element.id_usuario) ? 'expand_less' : 'expand_more' }}
   */
  isExpanded(id: number): boolean {
    return this.expandedRows.has(id);
  }

  /**
   * getHistorial(id): Devuelve el arreglo de encuestas del usuario con ese ID.
   * Si no hay historial, devuelve un arreglo vacío [] para evitar errores en el HTML.
   * 
   * 🔗 CONEXIÓN CON HTML:
   * - Se usa en *ngFor para recorrer las encuestas del historial:
   *   *ngFor="let encuesta of getHistorial(element.id_usuario)"
   * - Se usa en *ngIf para verificar si hay encuestas:
   *   *ngIf="getHistorial(element.id_usuario).length > 0"
   */
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
