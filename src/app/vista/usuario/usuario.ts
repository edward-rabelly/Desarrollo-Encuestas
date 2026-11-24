import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 👈 NUEVO: Importar Router
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tabla } from '../../component/tabla/tabla';
import { UsuarioService } from '../../servicios/usuario.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    Tabla
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit {
  
  dataSource: any[] = [];
  isLoading = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router, // 👈 NUEVO: Inyectar Router
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;

    this.usuarioService.getClientes().subscribe({
      next: (data) => {
        this.dataSource = data;
        console.log('✅ Usuarios cargados:', this.dataSource);
        
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar usuarios:', error);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  // 
    verHistorial(usuario: any) {
  // 👇 Verificar si el usuario que hace clic es el dueño del historial
  const usuarioLogueado = this.authService.getUsuarioActual();
  
  if (!usuarioLogueado) {
    console.warn('⚠️ No hay usuario logueado');
    return;
  }

  const idSesion = String(usuarioLogueado.id_usuario || usuarioLogueado.id);
  const idDelBoton = String(usuario.id_usuario);

  if (idSesion !== idDelBoton) {
    console.warn('⛔ No puedes ver el historial de otro usuario');
    // Opcional: mostrar un SweetAlert o mensaje
    return;
  }

  // ✅ Solo si coincide, navegar
  this.router.navigate(['/encuesta-usuario', usuario.id_usuario]);
}
}