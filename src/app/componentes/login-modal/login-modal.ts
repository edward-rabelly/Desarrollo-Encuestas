import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-modal',
  standalone: true, // Importante si usas Angular 14+
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrls: ['./login-modal.css']
})
export class LoginModalComponent {
  @Output() loginExitoso = new EventEmitter<any>();
  
  mostrarModal = false;
  modo: 'login' | 'registro' = 'login';
  mensaje = '';
  esError = false;

  usuario = {
    nombre: '',
    tipo_documento: '',
    numero_documento: '',
    email: '',
    edad: null, 
    genero: '',
    contrasena: ''
  };

  private apiUrl = 'https://api-encuestas-2vld.onrender.com/api/usuarios';

  constructor(private http: HttpClient) {}

  abrirModal() { this.mostrarModal = true; this.mensaje = ''; }
  cerrarModal() { this.mostrarModal = false; this.limpiarFormulario(); }
  
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
    this.http.post(`${this.apiUrl}/login`, {
      email: this.usuario.email,
      contrasena: this.usuario.contrasena
    }).subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
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
    this.http.post(this.apiUrl, this.usuario).subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('usuario', JSON.stringify(respuesta));
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
    this.usuario = { nombre: '', tipo_documento: 'CC', numero_documento: '', email: '', edad: null, genero: '', contrasena: '' };
  }
}


