import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 👈 NUEVO: Importar Router
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tabla } from '../../component/tabla/tabla';
import { UsuarioService } from '../../servicios/usuario.service';

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
    private cdr: ChangeDetectorRef
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
    if (usuario && usuario.id_usuario) {
      console.log('👉 Navegando al historial del usuario ID:', usuario.id_usuario);
      this.router.navigate(['/encuesta-usuario', usuario.id_usuario]);
    } else {
      console.error('❌ El usuario no tiene un id_usuario válido', usuario);
    }
  }
}