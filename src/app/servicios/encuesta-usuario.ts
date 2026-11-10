import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EncuestaUsuario {
  id_respuesta?: number;
  id_usuario: number;
  id_encuesta: number;
  id_pregunta: number;
  respuesta: string;
  fecha?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EncuestaUsuarioService {
  // ⚠️ Asegúrate de que esta URL sea la correcta de tu backend
  private apiUrl = 'https://api-encuestas-2vld.onrender.com/api/respuestas';

  constructor(private http: HttpClient) {}

  // Coincide con: router.get('/', obtenerRespuestas);
  getRespuestas(): Observable<EncuestaUsuario[]> {
    return this.http.get<EncuestaUsuario[]>(this.apiUrl);
  }

  // Coincide con: router.get('/:id', obtenerRespuestaPorId);
  getRespuestaPorId(id: number): Observable<EncuestaUsuario> {
    return this.http.get<EncuestaUsuario>(`${this.apiUrl}/${id}`);
  }

  // Coincide con: router.get('/usuario/:idUsuario/encuesta/:idEncuesta', obtenerRespuestasPorUsuarioYEncuesta);
  getRespuestasPorUsuarioYEncuesta(idUsuario: number, idEncuesta: number): Observable<EncuestaUsuario[]> {
    return this.http.get<EncuestaUsuario[]>(`${this.apiUrl}/usuario/${idUsuario}/encuesta/${idEncuesta}`);
  }

  // Coincide con: router.post('/', crearRespuesta);
  crearRespuesta(respuesta: EncuestaUsuario): Observable<EncuestaUsuario> {
    return this.http.post<EncuestaUsuario>(this.apiUrl, respuesta);
  }

  // Coincide con: router.put('/:id', actualizarRespuesta);
  actualizarRespuesta(id: number, respuesta: EncuestaUsuario): Observable<EncuestaUsuario> {
    return this.http.put<EncuestaUsuario>(`${this.apiUrl}/${id}`, respuesta);
  }

  // Coincide con: router.delete('/:id', eliminarRespuesta);
  eliminarRespuesta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}