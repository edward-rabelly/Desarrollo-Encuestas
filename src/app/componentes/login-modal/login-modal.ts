import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../servicios/auth.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// SweetAlert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, //  Cambia FormsModule por ReactiveFormsModule
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css'
})


// aqui gestino la interface de login y registro, ademas de que de que se valide toda la informacion que este en el formulario

export class LoginModalComponent {

    /** Evento que emite los datos del usuario hacia el componente padre cuando el login es exitoso */
  @Output() loginExitoso = new EventEmitter<any>();
  

  //controla la visibilidad del modal , inicia 
  mostrarModal = false;

  //estado del modal si es login muestra login o registro y se va al onSubmit
  modo: 'login' | 'registro' = 'login';

  /** Inica el false para que no muestre los mensajes de errores y si se escoge una opcion va a el onsubmit */
  submitted = false; 
  

  // hace que incie la contraseña con los puntos, yo escribo pero en la vista muestra solo puntos
  hidePassword = true; //  Variable para mostrar/ocultar contraseña
   
  //instancia el formulario
  loginForm!: FormGroup; // Formulario reactivo

  // se encarga de hace rlas inyecciones necesarias
  constructor(
    private authService: AuthService, // serrivcio creado
    private fb: FormBuilder // biblioteca de angular
  ) {
    // Se ejecuta inmediatamente al cargar el componente para preparar el formulario
    this.crearFormulario();
  }

  //  Crear el formulario con validadores
    crearFormulario(): void {
    this.loginForm = this.fb.group({
      // CAMPOS FANTASMA: Nacen desactivados. Angular los ignora por completo.
      nombre: [{ value: '', disabled: true }],
      tipo_documento: [{ value: 'CC', disabled: true }],
      numero_documento: [{ value: '', disabled: true }],
      edad: [{ value: null, disabled: true }],
      genero: [{ value: '', disabled: true }],
      
      // CAMPOS VIVOS: Estos sí importan en el Login.
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
   
  // los campos anteriores dicen que hay campos que son del formulario que dependiendo del modo no son obligarios mostrar peor otros que si
  
  
  // Getter para acceder fácil a los controles desde el HTML


  abrirModal() {
    this.mostrarModal = true;
    //cuando se activa , ahora si lo muestra
   //his.submitted = false;
    //es para que los datos no muestren un error
    this.cambiarModo('login'); 
    // es par ala opcion de que modo escoge el usuario
  }

  cerrarModal() {
    this.mostrarModal = false;
    //para cerrar el modal despues de que le de x en el boton de la skina
    this.limpiarFormulario();
    // es para borrar los datos que puede que el usuario haya escrito
  }
   
  //estas dos partes es para abrir la ventana completa, con la parte oscura 

  // aqui decimos que estos campos tienen ciertas condiciones para ser validos 
 cambiarModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    // el usuario escoge alguno de los dos
    this.submitted = false;
    // para que los valores no esten por defecto en rojo
    this.limpiarFormulario();
    // para borrar datos si ya escribo alguno

    const camposRegistro = ['nombre', 'tipo_documento', 'numero_documento', 'edad', 'genero'];

    if (modo === 'registro') {
      // MODO REGISTRO: Despertamos a los fantasmas y les damos sus reglas
      this.loginForm.get('nombre')?.enable();// busca el campo nombre y ? verifica que exista en el formulario
      this.loginForm.get('nombre')?.setValidators([Validators.required, Validators.minLength(3)]);

      this.loginForm.get('tipo_documento')?.enable();
      this.loginForm.get('tipo_documento')?.setValidators([Validators.required]);

      this.loginForm.get('numero_documento')?.enable();
      this.loginForm.get('numero_documento')?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);

      this.loginForm.get('edad')?.enable();
      this.loginForm.get('edad')?.setValidators([Validators.required, Validators.min(1), Validators.max(120)]);

      this.loginForm.get('genero')?.enable();
      this.loginForm.get('genero')?.setValidators([Validators.required]);

    } else {
      // Estos dos campos funcionan para salir de registro pero sin inconvenientes, osea que peuda salir de esto pero que 
      // se salga sin guradar informacion, esto sirve para quitar la informacion puesta y que pueda salir de aqui
      // y vamos con el foreach para cada salto de sitio
      camposRegistro.forEach(campo => {
        this.loginForm.get(campo)?.disable();
        this.loginForm.get(campo)?.clearValidators();
      });
    }

    // Le decimos a Angular: "Recalcula si el formulario es válido con estos nuevos cambios"
    this.loginForm.updateValueAndValidity();
  }

  //  Método onSubmit como en el ejemplo del profe
  onSubmit() {
    this.submitted = true;

    // Validación: si el formulario es inválido, no hace nada
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor revisa los campos necesarios.',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }
     
    // aqui es cuando todos los campos son validos y se escoge una opcion
    // ya que si esat en login va a iniciar sesion y si esta en regitro va a registrar
    this.modo === 'login' ? this.iniciarSesion() : this.registrar();
  }

  // el signo de esclamacion es apra cambiar de estado, arriva esta la contraseña con puntos pero aqui
  // decimos que esta constraseña peude verce 
togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}
  
  //mensaje mientras se verifican los campos
  iniciarSesion() {
    // Loading de SweetAlert como en el ejemplo
    Swal.fire({
      title: 'Iniciando sesión...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    //pase a que puede ser cualquiera,  se revisan en la base de datos en que este ese dato
    const { email, contrasena } = this.loginForm.value;
    
    //despues de verificar le manda al autoservicio el email y contraseña, con el suscribe es para esperar en lo que esto se verifica
    this.authService.login(email, contrasena).subscribe({
      next: (respuesta: any) => {// si esta bien este pasa a next que la
        this.authService.guardarSesion(respuesta.usuario); //esto e sapra decir el login esta bien, sus datos si estan correctos
        this.loginExitoso.emit(respuesta.usuario);// aqui decimos qeu esta bien, envia el mensaje y que peude cerrar el modal 
        
        // y si estan bien aparece esta respuesta
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola ${respuesta.usuario.nombre}, sesión iniciada.`,
          timer: 1500,
          timerProgressBar: true //barra en al parte de abajo
        });
        

        // despues del mensaje decimos qeu loo puede cerrar
        this.cerrarModal();
      },
       
      //si estan mal aparece esta respuesta
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Revisa tu email o contraseña.',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  }
  

  registrar() {
    Swal.fire({
      title: 'Creando cuenta...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.registrar(this.loginForm.value).subscribe({
      next: (respuesta: any) => {
        this.authService.guardarSesion(respuesta);
        this.loginExitoso.emit(respuesta);

        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: `Hola ${respuesta.nombre}, ya estás registrado.`,
          timer: 1500,
          timerProgressBar: true
        });

        this.cerrarModal();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Puede que el email ya exista. Inténtalo de nuevo.',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  }
  
  //esat parte limpia mi login o registro, los devuelve al estado inicial
  limpiarFormulario() {
    this.loginForm.reset({
      nombre: '',
      tipo_documento: 'CC',
      numero_documento: '',
      email: '',
      edad: null,
      genero: '',
      contrasena: ''
    });
    this.submitted = false;
  }
}


