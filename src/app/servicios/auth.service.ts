import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'https://api-encuestas-2vld.onrender.com/api/usuarios';

  // Subject que avisa cuando cambia el estado de sesión
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuarioActual$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    // ✅ VERIFICACIÓN DE SEGURIDAD PARA SSR (Server-Side Rendering)
    // El servidor no tiene localStorage, así que solo lo leemos si estamos en el navegador.
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('usuario_actual');
      if (usuarioGuardado) {
        this.usuarioSubject.next(JSON.parse(usuarioGuardado));
      }
    }
  }

  login(email: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, contrasena });
  }

  registrar(datosUsuario: any): Observable<any> {
    return this.http.post(this.apiUrl, datosUsuario);
  }

  guardarSesion(usuario: any): void {
    // ✅ Protegido para el servidor
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('usuario_actual', JSON.stringify(usuario));
    }
    this.usuarioSubject.next(usuario); // Notifica a todos los componentes
  }

  cerrarSesion(): void {
    // ✅ Protegido para el servidor
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('usuario_actual');
    }
    this.usuarioSubject.next(null); // Notifica a todos los componentes
  }

  getUsuarioActual(): any {
    return this.usuarioSubject.value;
  }

  estaLogueado(): boolean {
    return !!this.usuarioSubject.value;
  }
}