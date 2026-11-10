import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service'; 


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, // 👈
    MatInputModule,     // 👈
    MatSelectModule,    // 👈
    MatButtonModule,    // 👈
    MatIconModule ],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css' // 👈 Corregido: styleUrl (singular)
})
export class LoginModalComponent {
  @Output() loginExitoso = new EventEmitter<any>();
  
  mostrarModal = false;
  modo: 'login' | 'registro' = 'login';
  mensaje = '';
  esError = false;

  usuario = {
    nombre: '',
    tipo_documento: 'CC', // Valor por defecto
    numero_documento: '',
    email: '',
    edad: null as number | null,
    genero: '',
    contrasena: ''
  };

  // 👈 Inyectamos el AuthService, NO el HttpClient
  constructor(private authService: AuthService) {}

  abrirModal() { 
    this.mostrarModal = true; 
    this.mensaje = ''; 
  }

  cerrarModal() { 
    this.mostrarModal = false; 
    this.limpiarFormulario(); 
  }
  
  cambiarModo(modo: 'login' | 'registro') {
    this.modo = modo;
    this.mensaje = '';
  }

  enviarFormulario() {
    this.mensaje = '';
    this.esError = false;
    this.modo === 'login' ? this.iniciarSesion() : this.registrar();
  }

   iniciarSesion() {
    this.authService.login(this.usuario.email, this.usuario.contrasena).subscribe({
      next: (respuesta: any) => {
        // ✅ CAMBIO CLAVE: Usamos el método del servicio que notifica a todos los componentes
        this.authService.guardarSesion(respuesta.usuario);
        
        this.loginExitoso.emit(respuesta.usuario);
        this.cerrarModal();
      },
      error: () => {
        this.mensaje = 'Credenciales incorrectas';
        this.esError = true;
      }
    });
  }

  registrar() {
    this.authService.registrar(this.usuario).subscribe({
      next: (respuesta: any) => {
        // ✅ CAMBIO CLAVE: Usamos el método del servicio que notifica a todos los componentes
        this.authService.guardarSesion(respuesta);
        
        this.loginExitoso.emit(respuesta);
        this.cerrarModal();
      },
      error: () => {
        this.mensaje = 'Error al registrar el usuario';
        this.esError = true;
      }
    });
  }

  limpiarFormulario() {
    this.usuario = { 
      nombre: '', 
      tipo_documento: 'CC', 
      numero_documento: '', 
      email: '', 
      edad: null, 
      genero: '', 
      contrasena: '' 
    };
  }
}



