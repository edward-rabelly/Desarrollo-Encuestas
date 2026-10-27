import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// 1. Definimos la interfaz que coincide exactamente con tu base de datos y backend
export interface Usuario {
  id_usuario?: number;
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  edad: number;
  genero: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // 2. URL de TU backend local (asegúrate de que el backend esté corriendo con 'npm run dev')
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  // 3. Obtener todos los usuarios (antes getClientes)
  getClientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // 4. Obtener un usuario por su ID
  getClientePorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // 5. Crear un nuevo usuario
  crearCliente(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // 6. Actualizar un usuario existente
  actualizarCliente(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // 7. Eliminar un usuario
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
   // 8. Obtener el historial de encuestas de un usuario específico
  getHistorialUsuario(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/historial`);
  }
}
