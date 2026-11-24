import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

//  Imports de Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-avatar-usuario',
  standalone: true, // es un componente independiente
  imports: [ // consus propias herramientas
    CommonModule, // Para usar *ngIf, *ngFor, etc.
    MatMenuModule,     // Para poder usar <mat-menu> en su HTML
    MatIconModule,    // Para poder usar <mat-icon>
    MatButtonModule,  // Para poder usar <button mat-button>
    MatDividerModule  // Para las líneas divisorias
  ],
  templateUrl: './avatar-usuario.html', //los archivos html que muestran este componente, como se va a mostrar
  styleUrl: './avatar-usuario.css'
})
export class AvatarUsuarioComponent implements OnInit {
  
  usuario: any = null; // decimos que el usuario puede estar logueado o no
  iniciales = ''; // puede empezar sin algun dato o usuario especifico
  colorIndex = 0; //  inicia en 0 por lo que no se a logueado o se a registrado

  constructor(
    private authService: AuthService, // servicio alc ual se conecta 
    private router: Router //servicio de navegacion
  ) {}
  

  //una vez haya hecho todo eso vaya a ngoninit
  ngOnInit() {
    this.cargarUsuario();
  }
   
  // metodo que pidio el ngoninit, que a su vez esta en el servicio de usuarioactual
  cargarUsuario() {
    this.usuario = this.authService.getUsuarioActual();
    

    //estos dos son para la parte visual porlo que no esta en el auth.service
    if (this.usuario) {
      this.iniciales = this.generarIniciales(this.usuario.nombre);
      this.colorIndex = this.generarIndiceColor(this.usuario.nombre);
    }
  }
  

  // este metodo dice que voy a mandar un nombre que esta en formato de string osea texto
  private generarIniciales(nombre: string): string {

    // si es formato esta vacio manda un signo de pregunta
    if (!nombre) return '?';
    // cada vez qeu vea un espacio en blanco lo parte, con el metodo split
    const partes = nombre.split(' ');
    //el mensaje esta pratido en dos
    return partes.length >= 2 
       //la primera de posicion y use esa,  luego ve el espacio y la primera posicion y usela
      ? (partes[0][0] + partes[1][0]).toUpperCase() 
      // esto es para casos raros como Ana
      : nombre.substring(0, 2).toUpperCase();
  }
  

  //cuaando se le genera un id se le asigna un color en el CSS
  private generarIndiceColor(texto: string): number {

    // empesamos en 0 la operacion
    let hash = 0;

    //recorre el nombre dos veces o avanza a la izquierda dos veces 
    for (let i = 0; i < texto.length; i++) {
       
      //al elevar el numero 5 veces 2a la 5 da 32 esto al mezclar los numeros dan variados, lo qeu aydua a que casi nadie tenga ese mismo color
      //charcodeat es para convierte la letra en un nuemro de idenmtificacion
      hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }
    //esto no es una division normal ya que al dividir da un numero con decimales y esas decimales son las que nos sirven para sacar el numero del color
    //math.abs convierte el nuemro negativo, si sale negativo, en un numero positivo
    return Math.abs(hash) % 10;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuario = null;
    this.router.navigate(['/']);
  }
}