import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // garantiza que todos los servicios y vistas estan bien organizadas
})
export class AuthService {
  
  private apiUrl = 'https://api-encuestas-2vld.onrender.com/api/usuarios';

  // Subject que avisa cuando cambia el estado de sesión
  private usuarioSubject = new BehaviorSubject<any>(null); // aqui digo que existe alguien llamado usuario, pero que este todavia puede estar logueado o no por eso el null
  // pero el behavior es que esta con una estructura en especifico, osea tiene nombre email pero que puede ser cualquier dato dentro de la base de datos y avisa si tiene un algun cambio

  usuarioActual$ = this.usuarioSubject.asObservable(); // aqui decimos que es un dato que peude estar en constante cambio y haciendo varias cosas a la vez por eos en observable

  constructor(private http: HttpClient) {
    //  VERIFICACIÓN DE SEGURIDAD PARA SSR (Server-Side Rendering)
    // si estamos en un servidor o en navegador
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      
      // rebisa si algun usuario dejo la sesion anterior abierta
      const usuarioGuardado = localStorage.getItem('usuario_actual');

      // si si estava antes logiado y no cerro sesion 
      if (usuarioGuardado) {
        
        // le dice a toda la aplicacion que muestre ese usuario logiado de antes
        this.usuarioSubject.next(JSON.parse(usuarioGuardado));
      }
    }
  }
  
  login(email: string, contrasena: string): Observable<any> {
    // aqui decimos que envia el paquete mas no que recibe algo, se lo envia al autoservicio
    return this.http.post(`${this.apiUrl}/login`, { email, contrasena });
  }
  
  //aqui enviamos todo el paquete completo al backend, y dentro de autoservice hay algo que lo loguea de una vez 
  // datoUsuario es el paquete completo de logueo
  registrar(datosUsuario: any): Observable<any> {
    return this.http.post(this.apiUrl, datosUsuario);
  }
  
  // aqui es lo  que se activa despues para que no se vuelva a loguear
  guardarSesion(usuario: any): void {
    // Verifica si el codigo se esta ejecutando en windows o en servidor
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {

      //guarda el usuario en memoria del navegador, y la instruccion de setitem es guardar el usuario actual, dentro de este hay un json de usuario
      // json.stringify lo traduce  todo lo del,logueo del suuario para que el codigo lo pueda guardar en memoria
      localStorage.setItem('usuario_actual', JSON.stringify(usuario));
    }
    this.usuarioSubject.next(usuario); // Notifica a todos los componentes
  }

  cerrarSesion(): void {
    // Protegido para el servidor
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // borra al usuario que este logueado en la memoria del navegador
      localStorage.removeItem('usuario_actual');
    }
    this.usuarioSubject.next(null); // Notifica a todos los componentes, dice que no hay nadie logueado
  }

  getUsuarioActual(): any {
    // el any dice que puede ser cualquier dato pero con una estructura especifica, no lo guarda en memoria simplemente lee el mensaje 
    return this.usuarioSubject.value;
  }

  // es un inteructor definitivo es un objeto que puede ser simplemente un true o false

  estaLogueado(): boolean {

    //al poner !! le decimos a la variable que sea estrictamente true o false  
    return !!this.usuarioSubject.value;
  }
}

