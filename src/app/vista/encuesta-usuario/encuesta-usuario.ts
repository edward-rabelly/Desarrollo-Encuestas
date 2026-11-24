import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Tabla } from '../../component/tabla/tabla';
import { EncuestaUsuarioService, EncuestaUsuario } from '../../servicios/encuesta-usuario';
import { AuthService } from '../../servicios/auth.service'; // 👈 NUEVO: Importar AuthService

@Component({
  selector: 'app-encuesta-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    Tabla
  ],
  templateUrl: './encuesta-usuario.html',
  styleUrl: './encuesta-usuario.css'
})
export class EncuestaUsuarioComponent implements OnInit {

  dataSource: EncuestaUsuario[] = [];
  isLoading = true;
  idUsuarioActual: string | number | null = null;
  nombreUsuario: string = '';
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private encuestaUsuarioService: EncuestaUsuarioService,
    private authService: AuthService // 👈 NUEVO: Inyectar AuthService
  ) {}

  ngOnInit() {
    // 👇 PASO 1: Obtener el usuario logueado DESDE el servicio (no desde localStorage directo)
    const usuarioLogueado = this.authService.getUsuarioActual();
    console.log('🔐 Usuario logueado:', usuarioLogueado);

    // 👇 PASO 2: Si NO hay nadie logueado, bloquear TODO
    if (!usuarioLogueado) {
      this.mensajeError = 'Debes iniciar sesión para ver el historial de encuestas.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return; // 👈 IMPORTANTE: Detener ejecución aquí
    }

    // 👇 PASO 3: Obtener el ID del usuario logueado
    const idSesion = String(usuarioLogueado.id_usuario || usuarioLogueado.id);
    console.log('🔑 ID de la sesión:', idSesion);

    // 👇 PASO 4: Leer el ID de la URL (si existe)
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('🔍 ID en la URL:', idParam);

    // 👇 PASO 5: Si hay ID en la URL, verificar que sea el MISMO usuario
    if (idParam) {
      if (String(idParam) !== idSesion) {
        // ⛔ El ID de la URL NO coincide con el usuario logueado
        this.mensajeError = 'No tienes permiso para ver el historial de otro usuario.';
        this.isLoading = false;
        this.cdr.detectChanges();
        return; // 👈 Bloquear
      }
      // ✅ El ID coincide, mostrar el historial propio
      this.idUsuarioActual = idSesion;
      this.nombreUsuario = usuarioLogueado.nombre;
      this.cargarRespuestas(this.idUsuarioActual);
    } else {
      // ✅ No hay ID en la URL, mostrar el historial propio
      this.idUsuarioActual = idSesion;
      this.nombreUsuario = usuarioLogueado.nombre;
      this.cargarRespuestas(this.idUsuarioActual);
    }
  }

  cargarRespuestas(idUsuario: string | number) {
    this.isLoading = true;
    this.mensajeError = '';

    this.encuestaUsuarioService.getRespuestasPorUsuario(idUsuario).subscribe({
      next: (respuestasFiltradas) => {
        this.dataSource = respuestasFiltradas;
        console.log(`✅ Respuestas del usuario ${idUsuario}:`, this.dataSource);

        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        console.error('❌ Error al cargar respuestas:', error);
        this.mensajeError = 'Ocurrió un error al cargar los datos.';
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  irAlLogin() {
    this.router.navigate(['/']);
  }
}