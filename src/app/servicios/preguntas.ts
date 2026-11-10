import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Pregunta {
  id_pregunta?: number;
  descripcion: string;
  tipo: string;
  id_encuesta: number;
}

@Injectable({
  providedIn: 'root',
})
export class Preguntas {
  // ⚠️ Asegúrate de que esta URL sea la correcta de tu backend
  private apiUrl = 'https://api-encuestas-2vld.onrender.com/api/preguntas';

  constructor(private http: HttpClient) {}

  // Coincide con: router.get('/', obtenerPreguntas);
  getPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.apiUrl);
  }

  // Coincide con: router.get('/:id', obtenerPreguntaPorId);
  getPreguntaPorId(id: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(`${this.apiUrl}/${id}`);
  }

  // Coincide con: router.get('/encuesta/:idEncuesta', obtenerPreguntasPorEncuesta);
  getPreguntasPorEncuesta(idEncuesta: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiUrl}/encuesta/${idEncuesta}`);
  }

  // Coincide con: router.post('/', crearPregunta);
  crearPregunta(pregunta: Pregunta): Observable<Pregunta> {
    return this.http.post<Pregunta>(this.apiUrl, pregunta);
  }

  // Coincide con: router.put('/:id', actualizarPregunta);
  actualizarPregunta(id: number, pregunta: Pregunta): Observable<Pregunta> {
    return this.http.put<Pregunta>(`${this.apiUrl}/${id}`, pregunta);
  }

  // Coincide con: router.delete('/:id', eliminarPregunta);
  eliminarPregunta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}