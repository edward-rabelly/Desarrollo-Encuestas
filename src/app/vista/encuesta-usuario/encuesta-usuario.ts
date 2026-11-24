import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // 👈 1. Importar Router
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon'; // 👈 2. Importar MatIconModule
import { MatButtonModule } from '@angular/material/button'; // 👈 3. Importar MatButtonModule
import { Tabla } from '../../component/tabla/tabla';
import { EncuestaUsuarioService } from '../../servicios/encuesta-usuario';

@Component({
  selector: 'app-encuesta-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,      // 👈 4. Agregarlo a los imports
    MatButtonModule,    // 👈 5. Agregarlo a los imports
    Tabla
  ],
  templateUrl: './encuesta-usuario.html',
  styleUrl: './encuesta-usuario.css'
})
export class EncuestaUsuarioComponent implements OnInit {
  
  dataSource: any[] = [];
  isLoading = true;
  idUsuarioActual: string | number | null = null;
  nombreUsuario: string = '';
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // 👈 6. Inyectar Router
    private cdr: ChangeDetectorRef,
    private encuestaUsuarioService: EncuestaUsuarioService
  ) {}

  ngOnInit() {
  const idParam = this.route.snapshot.paramMap.get('id');
  console.log('🔍 ID en la URL:', idParam);

  if (idParam) {
    this.idUsuarioActual = idParam;
    this.cargarRespuestas(this.idUsuarioActual);
  } else {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    console.log('📦 String crudo de localStorage:', usuarioGuardado);
    
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      console.log('👤 Objeto usuario parseado COMPLETO:', usuario);
      console.log('🔑 Todas las claves del objeto:', Object.keys(usuario));
      
      // 👇 PRUEBA: Intentamos buscar el ID en cualquiera de estos nombres comunes
      this.idUsuarioActual = usuario.id_usuario || usuario.id || usuario.idUsuario || usuario._id;
      this.nombreUsuario = usuario.nombre || usuario.name || 'Usuario';
      
      console.log('✅ ID detectado para usar:', this.idUsuarioActual);
      console.log('✅ Nombre detectado:', this.nombreUsuario);

      if (this.idUsuarioActual) {
        this.cargarRespuestas(this.idUsuarioActual);
      } else {
        console.error('❌ No se pudo encontrar el ID del usuario en el objeto:', usuario);
        this.mensajeError = 'Error: No se pudo identificar al usuario logueado.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      console.log('⚠️ No hay usuario logueado en localStorage');
      this.mensajeError = 'Debes iniciar sesión para ver el historial de encuestas.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}

    cargarRespuestas(idUsuario: string | number) {
    this.isLoading = true;
    this.mensajeError = '';

    
    this.encuestaUsuarioService.getRespuestasPorUsuario(idUsuario).subscribe({
      next: (respuestasFiltradas) => {
        this.dataSource = respuestasFiltradas; // Ya vienen filtradas del backend
        
        console.log(` Respuestas del usuario ${idUsuario} (traídas del backend):`, this.dataSource);

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
    this.router.navigate(['/']); // Ajusta '/' si tu ruta de login es diferente (ej: '/login')
  }
};