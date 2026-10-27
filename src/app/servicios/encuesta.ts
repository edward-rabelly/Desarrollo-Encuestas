import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Interfaces que coinciden con tu base de datos y backend
export interface Encuesta {
  id_encuesta?: number;
  codigo: string;
  descripcion: string;
}

export interface Pregunta {
  id?: number;
  id_pregunta?: number;
  descripcion: string;
  tipo: string;
  id_encuesta: number;
}

// Interfaz para las respuestas
export interface Respuesta {
  id_usuario: number;
  id_encuesta: number;
  id_pregunta: number;
  respuesta: string;
}

// 2. UNA SOLA CLASE EncuestaService con todos los métodos
@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  // 3. URLs de TU backend local
  private apiUrl = 'http://localhost:3000/api/encuestas';
  private apiPreguntasUrl = 'http://localhost:3000/api/preguntas';
  private apiRespuestasUrl = 'http://localhost:3000/api/respuestas';

  constructor(private http: HttpClient) {}

  // 4. Obtener todas las encuestas
  getEncuestas(): Observable<Encuesta[]> {
    return this.http.get<Encuesta[]>(this.apiUrl);
  }

  // 5. Obtener una encuesta por su ID
  getEncuestaPorId(id: number): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.apiUrl}/${id}`);
  }

  // 6. Crear una nueva encuesta
  crearEncuesta(encuesta: Encuesta): Observable<Encuesta> {
    return this.http.post<Encuesta>(this.apiUrl, encuesta);
  }

  // 7. Actualizar una encuesta existente
  actualizarEncuesta(id: number, encuesta: Encuesta): Observable<Encuesta> {
    return this.http.put<Encuesta>(`${this.apiUrl}/${id}`, encuesta);
  }

  // 8. Eliminar una encuesta
  eliminarEncuesta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 9. Obtener las preguntas de una encuesta específica
  getPreguntasPorEncuesta(idEncuesta: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiPreguntasUrl}/encuesta/${idEncuesta}`);
  }

  // 10. NUEVO: Enviar una respuesta individual
  crearRespuesta(respuesta: Respuesta): Observable<any> {
    return this.http.post<any>(this.apiRespuestasUrl, respuesta);
  }
}